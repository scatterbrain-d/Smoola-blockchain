const Wallet = require('./wallet');
const wallet = new Wallet();
console.log(wallet.toString());





//test to monitor dynamic difficulty by creating a string of 10 blocks

// const Blockchain = require('./blockchain');
// const bc = new Blockchain();

// for(let i = 0; i < 10; i++) {
//   console.log(bc.addBlock(`block ${i}`).toString());
// }
