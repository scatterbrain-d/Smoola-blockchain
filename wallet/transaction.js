const ChainUtil = require('../chain-util');

class Transaction {
  
  constructor() {
    this.id = ChainUtil.id();
    this.input = null;
    this.outputs = [];
  }
  
  //adding another transaction recipient within a single transaction payload
  update(senderWallet, recipient, amount) {
    
    //find sender's new balance after the new added transaction and update the output
    const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);
    
    if(amount > senderOutput.amount) {
      console.log(`Transaction amount (${amount}) exceeds balance.`);
      return;
    }
    
    senderOutput.amount = senderOutput.amount - amount;
    
    //add the output for the additional recipient 
    this.outputs.push({amount, address: recipient});
    
    //new signature must be generated because data has changed
    Transaction.signTransaction(this, senderWallet);
    
    console.log("UPDATING!!!");
    
    return this;
  }
  
  
  static newTransaction(senderWallet, recipient, amount) {
    
    const transaction = new this();
    
    if(amount > senderWallet.balance) {
      console.log(`Amount (${amount}) exceeds balance.`);
      return;
    }
    
    transaction.outputs.push(...[
      {
        amount: senderWallet.balance - amount,
        address: senderWallet.publicKey
      },
      {
        amount,
        address: recipient
      }
    ]);
    
    Transaction.signTransaction(transaction, senderWallet);
    
    return transaction;
  }
  
  
  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
    };
  }
  
  
  static verifyTransaction(transaction) {
    return ChainUtil.verifySignature(
      transaction.input.address,
      transaction.input.signature,
      ChainUtil.hash(transaction.outputs)
    )}
}

module.exports = Transaction;