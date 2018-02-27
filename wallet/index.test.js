const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');

describe('Wallet', () => {
  let wallet, tPool;
  
  beforeEach(() => {
    wallet = new Wallet();
    tPool = new TransactionPool();
  });
  
  describe('creating a transaction', () => {
    let transaction, sendAmount, recipient;
    
    beforeEach(() => {
      sendAmount = 80;
      recipient = 'yomama';
      transaction = wallet.createTransaction(recipient, sendAmount, tPool);
      console.log("B1 OUTPUTS:" + transaction.outputs.map(output => `${output}`));
    });
    
    //testing same transaction carried out twice to ensure proper updating
    describe('then doing the same transaction again', () => {
      
      beforeEach(() => {
        wallet.createTransaction(recipient, sendAmount, tPool);
        console.log("B2 OUTPUTS:" + transaction.outputs.map(output => `${output}`));
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
})