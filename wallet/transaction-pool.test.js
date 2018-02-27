const TransactionPool = require('./transaction-pool');
const Transaction =     require('./transaction');
const Wallet =          require('./index');

describe('TransactionPool', () => {
  let tPool, wallet, transaction;
  
  beforeEach(() => {
    wallet = new Wallet();
    tPool =  new TransactionPool();
    
    transaction = Transaction.newTransaction(wallet, 'yomama', 50);
    
    tPool.updateOrAddTransaction(transaction);
  });
  
  it('adds a transaction to the pool', () => {
    expect(tPool.transactions.find(trans => trans.id === transaction.id)).toEqual(transaction);
  });
  
  it('updates a transaction in the pool', () => {
    const oldTransaction = JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet, 'geralt', 99);
    tPool.updateOrAddTransaction(newTransaction);
    
    expect(JSON.stringify(tPool.transactions.find(trans => trans.id === newTransaction.id)))
      .not.toEqual(oldTransaction);
  });
});