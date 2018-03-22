const {INITIAL_BALANCE} = require('../config');
const Transaction       = require('./transaction');
const Utility           = require('../utility');

/*                       **** WALLET ****
 
   This class creates a wallet which keeps track of a 
   balance, creates transactions, and provides public and
   private encryption keys to serve as a public address and
   securely sign transactions, respectively.
 
   * toString - returns the contents of the wallet to the console
 
   * sign - provides a secure signature to transactions through encryption
   means contained in ChainUtil file.
 
   * createTransaction - first calculates balance and checks to see if sender 
   can afford the transaction, then checks to see if a transaction from the
   sender already exists in transaction pool. If so, it updates that
   transaction with new information. If not, it creates a new transaction
   and adds it to the pool.
 
   * calculateBalance - uses blockchain record to return balance. First it
   searches blockchain for all transactions originated by user and grabs user's
   output balance from the last transaction found. Then checks output of all
   other transactions after that period to see if user received additional 
   payment from others and adds those found to the balance. If no transactions
   are found, balance is set to INITIAL_BALANCE.

   * blockChainWallet - creates a wallet for the blockchain in order to send
   reward transactions for mining.
*/


class Wallet {
  constructor() {
    this.balance   = INITIAL_BALANCE;
    this.keyPair   = Utility.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }
  
  
  toString() {
    return `
      Your wallet:
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