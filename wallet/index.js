const {INITIAL_BALANCE} = require('../config');
const Transaction       = require('./transaction');
const ChainUtil         = require('../chain-util');

// **** WALLET ****


class Wallet {
  constructor() {
    this.balance   = INITIAL_BALANCE;
    this.keyPair   = ChainUtil.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }
  
  toString() {
    return `wallet:
      publicKey :${this.publicKey.toString()}
      balance   :${this.balance}`;
  }
  
  sign(dataHash) {
    return this.keyPair.sign(dataHash);
    
  }
  
  createTransaction(recipient, amount, blockchain, transactionPool) {
    
    this.balance = this.calculateBalance(blockchain);
    
    if(amount > this.balance) {
      console.log(`Transaction request (${amount}) exceeds current balance (${this.balance}).`);
      return;
    }
    
    //check for existing transaction in the pool, then update or push accordingly
    let transaction = transactionPool.existingTransaction(this.publicKey);

    if (transaction) {
      transaction.update(this, recipient, amount);
    
    } else {
      transaction = Transaction.newTransaction(this, recipient, amount);
      transactionPool.updateOrAddTransaction(transaction);
    }
    
    return transaction;
  }
  
  calculateBalance(blockchain) {
    let balance = this.balance;
    let transactions = [];
    
    blockchain.chain.forEach(block => block.data.forEach(transaction => 
      transactions.push(transaction)
    ));
    
    const relevantTransactions = transactions.filter(transaction => 
      transaction.input.address === this.publicKey);
    
    let startTime = 0;
    
    if(relevantTransactions.length > 0) {
      const lastTransaction = relevantTransactions.reduce((prev, current) =>
        prev.input.timestamp > current.input.timestamp ? prev : current
      );
    
      balance = lastTransaction.outputs.find(output => output.address = this.publicKey).amount;
      startTime = lastTransaction.input.timestamp;
    }
    
    transactions.forEach(transaction => {
      if(transaction.input.timestamp > startTime) {
        transaction.outputs.find(output => {
          if(output.address === this.publicKey) {
            balance += output.amount;
          }
        });
      }
    });
    return balance;
  }
  
  static blockchainWallet() {
    const blockchainWallet = new this();
    blockchainWallet.address = 'blockchain-wallet';
    return blockchainWallet;
  }
}

module.exports = Wallet;