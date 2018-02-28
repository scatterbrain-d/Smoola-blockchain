const SHA256 = require('crypto-js/sha256');
const uuid   = require('uuid/v1');
const EC     = require('elliptic').ec;
const ec     = new EC('secp256k1');

//                      **** UTILITY FUNCTIONS ****
//
//   This class contains utility functions provided by the cryptography
//   dependencies listed above.
//
//   * genKeyPair - creates public and private keys for a user's wallet.
//
//   * id - creates a unique id for each transaction.
//
//   * hash - generates a 32-character hash based on a given data object.
//
//   * verifySignature - verifies an encrypted signature using the public key
//   and the given hash.

class Utility {
  
  
  static genKeyPair() {
    return ec.genKeyPair();
  }
  
  
  static id() {
    return uuid();
  }
  
  
  static hash(data) {
    return SHA256(JSON.stringify(data)).toString();
  }
  
  
  static verifySignature(publicKey, signature, dataHash) {
    return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
  }
}

module.exports = Utility;