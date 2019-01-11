/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */

// works in strict mode


// require the handler module.
// declaring a constant variable.
const { TransactionHandler } = require('sawtooth-sdk/processor/handler');


const {
  InvalidTransaction,
  InternalError,
} = require('sawtooth-sdk/processor/exceptions');
const crypto = require('crypto');
const { TextEncoder, TextDecoder } = require('text-encoding/lib/encoding');

const _hash = x => crypto.createHash('sha512').update(x).digest('hex').toLowerCase();
const encoder = new TextEncoder('utf8');
const decoder = new TextDecoder('utf8');
const MIN_VALUE = 0;
const CJ_FAMILY = 'hygieia';
const CJ_NAMESPACE = _hash(CJ_FAMILY).substring(0, 6);
let addrList = [];


class HygieiaHandler extends TransactionHandler {
  constructor() {
    super(CJ_FAMILY, ['1.0'], [CJ_NAMESPACE]);
    
  }

  decodepayload(payload) {
    const payloadDecoded = {
      bgroup: payload[0],
      part: payload[1],
      Gender: payload[2],
      idNo: payload[3],
      Date: payload[4],
      name: payload[5],
      proc: payload[6],
      action: payload[7],
    };
    return payloadDecoded;
  }

  removeAddress(address) {
    Array.prototype.remByVal = function (address) {
      for (let i = 0; i < this.length; i++) {
        if (this[i] === address) {
          this.splice(i, 1);
          i--;
        }
      }
      return this;
    };
  }

  apply(transacationProcessRequest, context) {
    let newTxnId = '';
    let newStatus = '';
    let newRecp = '';
   
    const payload = transacationProcessRequest.payload.toString().split(',');
    const pl = this.decodepayload(payload);
  
    const header = transacationProcessRequest.header;
    const pblckey = header.signerPublicKey;
    const ipaddr = header.inputs[0];
    const superAddress = _hash('hygieia').substring(0, 70);
    
    const txnId = transacationProcessRequest.signature;
    

    if (pl.action == 'add') {
      const address = _hash('hygieia').substr(0, 6) + _hash(pl.proc).substr(0, 16) + _hash(pl.bgroup).substr(0, 16) + _hash(pl.part).substr(0, 16) + _hash(pl.idNo).substr(0, 16);

      return context.getState([address, superAddress])
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

          addrLst.push(address);
            console.log('addrlst--->', addrLst);
            const addressJson = {
              address: addrLst,
            };
            const addressString = JSON.stringify(addressJson);
            const addressEncoded = encoder.encode(addressString);
            const superVal = {
              [superAddress]: addressEncoded,
            };

          


         const myState = currentStateMap[address];
          if (myState == '' || myState == null) { // registering from NHS
            newTxnId = txnId;
            newStatus = 'Unmatched';
            newRecp = '';

            // adding state
            const stateData = {
              Status: newStatus,
              Txnid: newTxnId,
              Recp: newRecp,

            };         
            
            const mynewState = encoder.encode(JSON.stringify(stateData));
            console.log('mynewState', mynewState);
            const newStateMap = {
              [address]: mynewState,
              
            };
            
            
            context.setState(superVal);
            return context.setState(newStateMap);
            
          }

          console.log('Address already in use');

         
        });
    }

    else{
      throw new InvalidTransaction("Invalid payload or header")
    }
  }
}
module.exports = HygieiaHandler;
