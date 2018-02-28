const Transaction = require('../wallet/transaction');

class TransactionPool {
  constructor() {
    this.transactions = [];
  }
  
  updateOrAddTransaction(transaction) {
    //check if transaction with this id already exists in the pool
    let transactionWithId = this.transactions.find(trans => {
      trans.id === transaction.id});
    
    //if so, update
    if(transactionWithId) {
      this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
    //if not, add to pool
    } else {
      this.transactions.push(transaction);
    }
  }
  
  existingTransaction(address) {
    return this.transactions.find(trans => trans.input.address === address);
  }
  
  validTransactions() {
    return this.transactions.filter(transaction => {
      const outputTotal = transaction.outputs.reduce((total, output) => {
        return total + output.amount;
      }, 0);
      
      if(transaction.input.amount !== outputTotal) {
        console.log(`Invalid transaction from ${transaction.input.address}.`);
        return;
      }
      
      if(!Transaction.verifyTransaction(transaction)) {
        console.log(`Invalid signature from ${transaction.input.address}.`);
        return;
      }
      
      return transaction;
    });
  }
  
  clear() {
    this.transactions = [];
  }
}

module.exports = TransactionPool;