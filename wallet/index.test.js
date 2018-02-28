const {INITIAL_BALANCE} = require('../config');
const TransactionPool   = require('./transaction-pool');
const Blockchain        = require('../blockchain');
const Wallet            = require('./index');


describe('Wallet', () => {
  let wallet, tPool, bc;
  
  beforeEach(() => {
    wallet = new Wallet();
    tPool  = new TransactionPool();
    bc     = new Blockchain();
  });
  
  describe('creating a transaction', () => {
    let transaction, sendAmount, recipient;
    
    beforeEach(() => {
      sendAmount  = 80;
      recipient   = 'yomama';
      transaction = wallet.createTransaction(recipient, sendAmount, bc, tPool);
    });
    
//      **** CREATETRANSACTION UPDATING TRANSACTIONS ****

    describe('then doing the same transaction again', () => {
      
      beforeEach(() => {
        wallet.createTransaction(recipient, sendAmount, bc, tPool);
      });
      
      it('doubles the `sendAmount` subtracted from the wallet balance', () => {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
          .toEqual(wallet.balance - sendAmount * 2);
      });
      
      it('clones the `sendAmount` output for the recipient', () => {
        expect(transaction.outputs.filter(output => output.address === recipient)
          .map(output => output.amount)).toEqual([sendAmount, sendAmount]);
      });
    });
  });
  
//                         **** CALCULATEBALANCE ****  
  
  describe('calculating the balance', () => {
    let addBalance, repeatAdd, senderWallet;
    beforeEach(() => {
      senderWallet = new Wallet();
      addBalance   = 99;
      repeatAdd    = 3;
      for(let i = 0; i < repeatAdd; i++) {
        senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tPool);
      }
      bc.addBlock(tPool.transactions);
    });
    
    it('calculates the balance for transactions matching the recipient', () => {
      expect(wallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE + (addBalance * repeatAdd));
    });
    
    it('calculates the balance for transactions matching the sender', () => {
      expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE - (addBalance * repeatAdd));
    });
    
    describe('and the recipient conducts a transaction', () => {
      let subtractBalance, recipientBalance;
      
      beforeEach(() => {
        tPool.clear();
        subtractBalance = 100;
        recipientBalance = wallet.calculateBalance(bc);
        wallet.createTransaction(senderWallet.publicKey, subtractBalance, bc, tPool);
        bc.addBlock(tPool.transactions);
      });
      
      describe('and the sender sends another transaction to the recipient', () => {
        beforeEach(() => {
          tPool.clear();
          senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tPool);
          bc.addBlock(tPool.transactions);
        });
        
        it('calculates the recipient balance using only most recent transaction', () => {
          expect(wallet.calculateBalance(bc)).toEqual(recipientBalance - subtractBalance + addBalance);
        });
      });
    });
  });
})