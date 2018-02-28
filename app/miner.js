const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet');

//                  **** MINER ****
//
//   This class ties together the blockchain, wallet,
//   and transactions to allow a user to create a block
//   with only valid transactions (including a reward 
//   transaction for the work), add that block to the
//   blockchain, then sync the new blockchain and 
//   transaction pool across the p2p server.

class Miner {
  constructor(blockchain, transactionPool, wallet, p2pServer) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }
  
  mine() {
    
    const validTransactions = this.transactionPool.validTransactions();
    
    validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()));
    
    const block = this.blockchain.addBlock(validTransactions);
    
    this.p2pServer.syncChains();
    this.transactionPool.clear();
    this.p2pServer.broadcastClearTransactions();
    
    return block;
  }
}

module.exports = Miner;