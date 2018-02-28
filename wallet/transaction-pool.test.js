const TransactionPool = require('./transaction-pool');
const Transaction     = require('./transaction');
const Blockchain      = require('../blockchain');
const Wallet          = require('./index');

describe('TransactionPool', () => {
  let tPool, wallet, transaction, bc;
  
  beforeEach(() => {
    wallet      = new Wallet();
    tPool       = new TransactionPool();
    bc          = new Blockchain();
    transaction = wallet.createTransaction('yomama', 50, bc, tPool);
  });

//                     **** UPDATEORADDTRANSACTION ****

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
  
//            **** CLEAR ****
  
  it('clears the transaction pool', () => {
    tPool.clear();
    expect(tPool.transactions).toEqual([]);
  });
  
//                **** VALIDTRANSACTIONS ****  

  describe('mixing valid and corrupt transactions', () => {
    let validTransactions;
    beforeEach(() => {
      validTransactions = [...tPool.transactions];
      for(let i = 0; i < 6; i++) {
        wallet      = new Wallet();
        transaction = wallet.createTransaction('yomama', 30, bc, tPool);
        if(i % 2 == 0) {
          transaction.input.amount = 1000000;
        } else {
          validTransactions.push(transaction);
        }
      }
    });
    
    it('shows a difference between valid and corrupt transactions', () => {
      expect(JSON.stringify(tPool.transactions)).not.toEqual(JSON.stringify(validTransactions));
    });
    
    it('grabs valid transactions', () => {
      expect(tPool.validTransactions()).toEqual(validTransactions);
    });
  });
});