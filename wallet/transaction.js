const {MINING_REWARD} = require('../config');
const Utility         = require('../utility');

/*                                **** TRANSACTION ****
 
    This class deals with generating, updating, signing, and verifying
    cryptocurrency transactions.
 
    * update - edits an existing transaction with additional details, adjusting
    sender balance and adding a new recipient accordingly. Then generates a new
    signature since the old one becomes invalid the moment the payload changes.

    * transactionHelper - when given outputs and the sender's wallet, creates a
    transaction and signs it. Reduces redundancy in newTransaction and rewardTransaction.
 
    * newTransaction - checks to ensure sender can afford it, then creates
    transaction. For use in peer to peer transactions.

    * rewardTransaction - rewards miners with transaction from the blockchain wallet.

    * signTransaction - uses cryptography in ChainUtil and data within transaction
    along with user's credentials to generate a secure signature for a transaction.

    * verifyTransaction - uses cryptography in ChainUtil to verify transaction based
    on its contents.
*/


class Transaction {
  constructor() {
    this.outputs = [];
    this.input   = null;
    this.id      = Utility.id();
  }
  

  update(senderWallet, recipient, amount) {
    const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);
    if(amount > senderOutput.amount) {
      console.log(`Transaction amount (${amount}) exceeds balance.`);
      return;
    }
    senderOutput.amount = senderOutput.amount - amount;
    this.outputs.push({amount, address: recipient});
    Transaction.signTransaction(this, senderWallet);
    return this;
  }
  
  
  static transactionHelper(senderWallet, outputs) {
    const transaction = new this();
    transaction.outputs.push(...outputs);
    Transaction.signTransaction(transaction, senderWallet);
    return transaction;
  }
  
  
  static newTransaction(senderWallet, recipient, amount) {
    if(amount > senderWallet.balance) {
      console.log(`Amount (${amount}) exceeds balance.`);
      return;
    }
    const outputs = 
      [{
        amount: senderWallet.balance - amount,
        address: senderWallet.publicKey
      },{
        amount,
        address: recipient
      }];
    return Transaction.transactionHelper(senderWallet, outputs);
  }
  
  
  static rewardTransaction(minerWallet, blockchainWallet) {
    return Transaction.transactionHelper(blockchainWallet, [{
      amount:  MINING_REWARD,
      address: minerWallet.publicKey
    }]);
  }
  
  
  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timestamp: Date.now(),
      amount:    senderWallet.balance,
      address:   senderWallet.publicKey,
      signature: senderWallet.sign(Utility.hash(transaction.outputs))
    };
  }
  
  
  static verifyTransaction(transaction) {
    return Utility.verifySignature(
      transaction.input.address,
      transaction.input.signature,
      Utility.hash(transaction.outputs)
    )}
}

module.exports = Transaction;