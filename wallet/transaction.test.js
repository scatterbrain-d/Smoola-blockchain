const {MINING_REWARD} = require('../config');
const Transaction     = require('./transaction');
const Wallet          = require('./index');


describe('Transaction', () => {
  
  let transaction, wallet, recipient, amount;
  
  beforeEach(() => {
    recipient   = 'yomama';
    wallet      = new Wallet();
    amount      = 100;
    transaction = Transaction.newTransaction(wallet, recipient, amount);
  });
  
//                  **** NEWTRANSACTION OUTPUTS ****

  it('outputs the `amount` subtracted from the wallet balance', () => {
    expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
      .toEqual(wallet.balance - amount);
  });
  
  it('outputs the `amount` added to the recipient', () => {
    expect(transaction.outputs.find(output => output.address === recipient).amount)
      .toEqual(amount);
  });
  
//               **** NEWTRANSACTION INPUT ****
  
  it('inputs the balance of the wallet', () => {
    expect(transaction.input.amount).toEqual(wallet.balance);
  });
  
//                **** VERIFYTRANSACTION ****
  
  it('validates a valid transaction', () => {
    expect(Transaction.verifyTransaction(transaction)).toBe(true);
  });
  
  it('invalidates a corrupt transaction', () => {
    transaction.outputs[0].amount = 999999;
    expect(Transaction.verifyTransaction(transaction)).toBe(false);
  });
  
//          **** NEWTRANSACTION WALLET BALANCE CHECK ****

  describe('transacting with an amount that exceeds the balance', () => {
    beforeEach(() => {
      amount      = 999999;
      transaction = Transaction.newTransaction(wallet, recipient, amount);
    });
    
    it('does not create the transaction', () => {
      expect(transaction).toEqual(undefined);
    });
  });
  
  describe('updating a transaction', () => {
    let nextAmount, nextRecipient;
    
    beforeEach(() => {
      nextRecipient = 'geralt';
      nextAmount    = 50;
      transaction   = transaction.update(wallet, nextRecipient, nextAmount);
    });
    
//                           **** UPDATE ****
    
    it('substracts the next amount from the sender output', () => {
      expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
        .toEqual(wallet.balance - amount - nextAmount);
    });
    
    it('outputs an amount for the next recipient', () => {
      expect(transaction.outputs.find(output => output.address === nextRecipient).amount)
        .toEqual(nextAmount);
    });
    
  });

//                      **** REWARDTRANSACTION ****

  describe('creating a reward transaction', () => {
    beforeEach(() => {
      transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet());
    });
    
    it('generates reward for miner', () => {
      expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
        .toEqual(MINING_REWARD);
    });
  });
});