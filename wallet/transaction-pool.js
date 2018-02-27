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
}

module.exports = TransactionPool;