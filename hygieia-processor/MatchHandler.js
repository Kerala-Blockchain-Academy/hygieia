
//works in strict mode
'use strict'

//require the handler module.
//declaring a constant variable.
const { TransactionHandler } = require('sawtooth-sdk/processor/handler')


const {
  InvalidTransaction,
  InternalError
} = require('sawtooth-sdk/processor/exceptions')
const crypto = require('crypto')
const {TextEncoder, TextDecoder} = require('text-encoding/lib/encoding')

const _hash = (x) => crypto.createHash('sha512').update(x).digest('hex').toLowerCase()
var encoder = new TextEncoder('utf8')
var decoder = new TextDecoder('utf8')
const MIN_VALUE = 0
const CJ_FAMILY = 'match'
const CJ_NAMESPACE = _hash(CJ_FAMILY).substring(0, 6)


class MatchHandler extends TransactionHandler {
  constructor() {
    super(CJ_FAMILY, ['1.0'], [CJ_NAMESPACE]);
    // console.log("Inside constructor")
  }

  decodepayload(payload) {
    const payloadDecoded = {
      recpaddr: payload[0],
      dnraddress: payload[1],
      action: payload[2],
       };
    return payloadDecoded;
  }

  


  removeAddress(address,addrList) {
  var addrlist= addrList
    for (let i = 0; i < addrlist.length; i++) {
      if (addrlist[i] === address) {
        addrlist.splice(i, 1);
        i--;
      }
    }
    return addrlist;
  
}

  apply(transacationProcessRequest, context) {
    let matchTxnId = '';
    let newStatus = '';
    let RecpAdress = '';
    let DonorAdress= '';
    
    const payload = transacationProcessRequest.payload.toString().split(',');
    const pl = this.decodepayload(payload);
    
    const header = transacationProcessRequest.header;
    const pblckey = header.signerPublicKey;
    const ipaddr = header.inputs[0];
    
    const txnId = transacationProcessRequest.signature;
    const superAddress = _hash('hygieia').substring(0, 70);
    

    

    if (pl.action == 'modify') {

      console.log ("Recp address is" + pl.recpaddr+ "Donor Adress is " +pl.dnraddress )

      return context.getState([pl.dnraddress, pl.recpaddr,superAddress])
      .then((currentStateMap) => {
        console.log('currentStateMap-->', currentStateMap);
        const prevMyState = currentStateMap[superAddress];
        console.log('prevMyState', prevMyState);
        const prevState = new Buffer(prevMyState, 'base64').toString();
        console.log('prevState', prevState);
        let addrLst = [];
       

        if (Object.keys(prevMyState).length !== 0) {
          console.log('not empty');
          const superState = decoder.decode(prevMyState);
          const superJson = JSON.parse(superState);
          addrLst = superJson.address;
        }


        

        const myState2 = currentStateMap[pl.recpaddr];
        if (myState2 != '' || myState2 != null) { // registering from NHS
         
          matchTxnId = txnId;
          newStatus = 'matched';
          DonorAdress = pl.dnraddress;

          const oldState2 = decoder.decode(myState2);
            const oldJson2 = JSON.parse(oldState2);
            let newTxnId2 = oldJson2.Txnid;
            console.log( "old txn id 2" +newTxnId2)
          // adding state
          const stateData2 = {
            Status: newStatus,
            Txnid: newTxnId2,
            Dnr: DonorAdress,
            Matchid:matchTxnId
          };     
          
          console.log("state data2" + JSON.stringify(stateData2))
          
          const mynewState2 = encoder.encode(JSON.stringify(stateData2));
          console.log('mynewState', mynewState2);
          const newStateMap2 = {
            [pl.recpaddr]: mynewState2
            
          };

          context.setState(newStateMap2);
 
         
        }
       


          const myState1 = currentStateMap[pl.dnraddress];
        if (myState1 != '' || myState1 != null) { // registering from NHS
          
          
          matchTxnId = txnId;
           newStatus = 'matched';
          RecpAdress = pl.recpaddr;

          const oldState1 = decoder.decode(myState1);
          const oldJson1 = JSON.parse(oldState1);
          console.log("Old json" +oldState1)
          let newTxnId1 = oldJson1.Txnid;
          console.log( "old txn id" +newTxnId1)
          // adding state
          const stateData1 = {
            Status: newStatus,
            Txnid: newTxnId1,
            Recp: RecpAdress,
            Matchid:matchTxnId

          };         

          console.log("state data1" + JSON.stringify(stateData1))
          
          const mynewState1 = encoder.encode(JSON.stringify(stateData1));
          console.log('mynewState', mynewState1);
          const newStateMap1 = {
            [pl.dnraddress]: mynewState1
            
          };

        
        
          context.setState(newStateMap1);
         
        }

        let addrlstrm =this.removeAddress(pl.dnraddress,addrLst);
          let addrlstrm1= this.removeAddress(pl.recpaddr,addrlstrm)
          console.log('addrlst--->', addrlstrm1);
         

          const addressJson = {
            address: addrlstrm1
          };
          const addressString = JSON.stringify(addressJson);
          const addressEncoded = encoder.encode(addressString);
          const superVal = {
            [superAddress]: addressEncoded
          };

          return context.setState(superVal);

        console.log('Address already in use');

      
      });
    }
  }
}
module.exports = MatchHandler;