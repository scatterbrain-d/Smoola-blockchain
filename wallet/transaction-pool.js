const Transaction = require('../wallet/transaction');

/*                         **** TRANSACTION POOL ****

   This class holds pending transactions in an array before they
   are added to a new block.

   * updateOrAddTransaction - receives new transactions from users. If
   sender already has a pending transaction, that transaction is updated to
   include the new information. Otherwise a new transaction is added to the pool.
 
   * existingTransaction - checks if a transaction from a given sender exists
   in the pool.
 
   * validTransactions - loops through transaction pool and performs checks to
   ensure validity of transactions. Returns an array of valid transactions to be
   placed in a block.
 
   * clear - empties transaction pool once all current valid transactions have
   been added to a block.
*/


class TransactionPool {
  constructor() {
    this.transactions = [];
  }
  
  
  updateOrAddTransaction(transaction) {
    let transactionWithId = this.transactions.find(trans => {
      trans.id === transaction.id});
    if(transactionWithId) {
      this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
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