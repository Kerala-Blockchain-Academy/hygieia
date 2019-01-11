import { Injectable } from '@angular/core';
import { createHash } from 'crypto-browserify';
import * as protobuf  from "sawtooth-sdk/protobuf";
import { CryptoFactory, createContext } from "sawtooth-sdk/signing";
import * as Secp256k1PrivateKey from 'sawtooth-sdk/signing/secp256k1';
import { HttpClient } from '@angular/common/http';
import {Buffer} from 'buffer/';
import { TextEncoder, TextDecoder} from "text-encoding/lib/encoding";
import { pipe } from '@angular/core/src/render3';



@Injectable({
  providedIn: 'root'
})
export class SawtoothService {

  private Family_name;
  private Family_version='1.0';
  private REST_API_BASE_URL='http://localhost:4200/api';
  

  public address:any;
  public publicKey:any;
  public signer:any;
  public addrNs:any;
  public addrm:any
 public addrArray:any;
 public  addrgen:any;
  
    
  constructor(private http:HttpClient) {
    this.address =  this.hash("hygieia").substr(0, 70) ;
    this.addrNs=this.hash("hygieia").substr(0,6)
    this.addrm = this.hash("this.addrgen").substr(0,70)
  }


  public hash(v) {
    return createHash('sha512').update(v).digest('hex');
  }

 
  //called for transaction creation

private getTransactionHeaderBytes(inputAddressList, outputAddressList, payload): any {
  
  const transactionHeaderBytes = protobuf.TransactionHeader.encode({
    familyName: this.Family_name,
    familyVersion: this.Family_version,
    inputs: [this.addrNs,this.address],
    outputs: [this.addrNs,this.address],
    signerPublicKey: this.publicKey,
    batcherPublicKey: this.publicKey,
    dependencies: [],
    payloadSha512: this.hash(payload),
    nonce: (Math.random() * 1000).toString()
  }).finish();

  return transactionHeaderBytes;
}

private getTransaction(transactionHeaderBytes, payloadBytes): any {
    const transaction = protobuf.Transaction.create({
    header: transactionHeaderBytes,
    headerSignature: this.signer.sign(transactionHeaderBytes),
    payload: payloadBytes
  });

  return transaction;
}
private getBatchHeaderBytes(transactionSignaturesList): any {
  console.log("Inside get BAtch list");
  const batchHeader = protobuf.BatchHeader.encode({
    signerPublicKey: this.publicKey,
    transactionIds: transactionSignaturesList
  }).finish();

  return batchHeader;
}

private getBatch(batchHeaderBytes, transactionsList): any {
  const batch = protobuf.Batch.create({
    header: batchHeaderBytes,
    headerSignature: this.signer.sign(batchHeaderBytes),
    transactions: transactionsList
  });

  return batch;
}

private getBatchListBytes(batchesList): any {
  const batchListBytes = protobuf.BatchList.encode({
    batches: batchesList
  }).finish();

  return batchListBytes;
}

private getBatchList(transactionsList) {
  
  const transactionSignatureList = transactionsList.map((tx) => tx.headerSignature);

  // Create batch header
  const batchHeader = this.getBatchHeaderBytes(transactionSignatureList);
  // Create the batch
  const batch = this.getBatch(batchHeader, transactionsList);
  // Batch List
  const batchList = this.getBatchListBytes([batch]);   

      return batchList
}

/*-------END Creating transactions & batches-----------*/

// Get state of address from rest api
private async getState(address): Promise<any> {
  const getStateURL = this.REST_API_BASE_URL + '/state/' + address;
  const fetchOptions = { method: 'GET' };
  return window.fetch(getStateURL, fetchOptions);
}

private getDecodedData(responseJSON): string {
  const dataBytes = responseJSON.data;
  const decodedData = new Buffer(dataBytes, 'base64').toString();
  return decodedData;
}


  public async sendToRestAPI(batchListBytes) :Promise<any>{
    if (batchListBytes == null) {
       //to match the donor n receipient we need txnid for detzai
      // GET state
      return this.getState(this.address)
        .then((response) => {
          console.log("batchlist null");
          return response.json();
        })
        .then((responseJson) => {
          console.log("batchlist null2");
          return this.getDecodedData(responseJson)
        })
        .catch((error) => {
          console.error(error);
        });
    }
    else {

      // POST batch list
      console.log("calling postBatchList");
      return this.postBatchList(batchListBytes)
    }
  }
  
  // Post batch list to rest api
  private postBatchList(batchListBytes): Promise<any> {
    const postBatchListURL = this.REST_API_BASE_URL + '/batches';
    const fetchOptions = {
      method: 'POST',
      body: batchListBytes,
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    }
    return window.fetch(postBatchListURL, fetchOptions);
  }


  public async getListData(){
   
    try{
      this.address =  this.hash("hygieia").substr(0, 70) ;
      
      return this.getState(this.address)
      .then((resp) => {
        console.log("sendToRestAPI response", resp);
        var addrArray=resp.toString().split(',')
       
        console.log("hello",addrArray);
        return addrArray; 
      })
      .catch((error) => {
        console.log("error here", error);
      })

   
      }
    catch (e) {
      console.log("Error in getting list  details", e);
      return "ERROR";
  }
  }
  superAddress(superAddress: any): any {
    throw new Error("Method not implemented.");
  }



  public async sendData(btype,otype,gender,idproof,date,name,proc,action,familyName) {

    this.Family_name = familyName;
    
    try{

    const context = createContext('secp256k1');
    // Creating a random private key 
    const privateKey = context.newRandomPrivateKey();
    this.signer = new CryptoFactory(context).newSigner(privateKey);
    this.publicKey=this.signer.getPublicKey().asHex();    
    // Encode the payload
    /*const payload = this.getEncodedData(action, values);*/    
    const data = btype + "," + otype+","+ gender+ "," + idproof+ ","+ date +","+ name +"," +proc+ ","+ action;
    console.log(data+"data");
    const encData=new TextEncoder('utf8').encode(data);
    console.log("ThisAddress"+this.address)
    const transactionHeader = this.getTransactionHeaderBytes([this.addrNs], [this.address], encData);
    console.log("After txn header")
    // Create transaction
    const transaction = this.getTransaction(transactionHeader, encData);
    console.log("After transaction")
    // Transaction list
    const transactionsList = [transaction];
    console.log("After transactionsList")
   // Create a list of batches. In our case, one batch only in the list
   const batchList = this.getBatchList(transactionsList);
   console.log("After batchList")

   // Send the batch to REST API
    await this.sendToRestAPI(batchList)
   .then((resp) => {
     console.log("sendToRestAPI response", resp);
   })
   .catch((error) => {
     console.log("error here", error);
   })
    return batchList;
  }
    catch (e) {
      console.log("Error in reading the key details", e);
      return "ERROR";
  }
  
  
  }




  public async matchadr(recpaddr,dnraddr,action,familyName){
    console.log("sawtooth service"+ recpaddr+dnraddr+action)

    this.Family_name = familyName;
    try{

      const context = createContext('secp256k1');
      // Creating a random private key 
      const privateKey = context.newRandomPrivateKey();
      this.signer = new CryptoFactory(context).newSigner(privateKey);
      this.publicKey=this.signer.getPublicKey().asHex();    
      // Encode the payload
      /*const payload = this.getEncodedData(action, values);*/    
      const data = recpaddr + "," + dnraddr+","+action;
      console.log(data+"data");
      const encData=new TextEncoder('utf8').encode(data);
      console.log("ThisAddress"+this.addrm)
      const transactionHeader = this.getTransactionHeaderBytes([this.addrNs], [this.addrm], encData);
      console.log("After txn header")
      // Create transaction
      const transaction = this.getTransaction(transactionHeader, encData);
      console.log("After transaction")
      // Transaction list
      const transactionsList = [transaction];
      console.log("After transactionsList")
     // Create a list of batches. In our case, one batch only in the list
     const batchList = this.getBatchList(transactionsList);
     console.log("After batchList")
  
     // Send the batch to REST API
      await this.sendToRestAPI(batchList)
     .then((resp) => {
       console.log("sendToRestAPI response", resp);
     })
     .catch((error) => {
       console.log("error here", error);
     })
      return batchList;
    }
      catch (e) {
        console.log("Error in reading the key details", e);
        return "ERROR";
    }

  }

  getStateD(addre){
    return this.http.get('http://localhost:4200/api/state/'+addre)

  }

  getTxnD(txnid){
    return this.http.get('http://localhost:4200/api/transactions/'+txnid)
  }



}
  


