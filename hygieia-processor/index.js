/* Copyright 2018 Intel Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ------------------------------------------------------------------------------
 */

/*this code specifies the Transaction Processor part.This code transfers the 
  transaction processing requests to a registered handler,the CookieJarHandler.*/
 

'use strict'
//works in strict mode
const { TransactionProcessor } = require('sawtooth-sdk/processor')
//requires the module specified in ().

const HygieiaHandler= require('./HygieiaHandler')
const MatchHandler = require('./MatchHandler')

if (process.argv.length < 3) {
  console.log('missing a validator address')
  process.exit(1)
}

const address = process.argv[2]

const transactionProcessor = new TransactionProcessor(address)

transactionProcessor.addHandler(new HygieiaHandler())
transactionProcessor.addHandler(new MatchHandler())

 /*addHandler adds the given handler to the transaction processor so
   it can receive transaction processing requests. All handlers must
   be added prior to starting the processor.
 */

transactionProcessor.start()
/* start connects the transaction processor to a validator and
   starts listening for requests and routing them to an appropriate
   handler.

*/
