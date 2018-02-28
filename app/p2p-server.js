const Websocket     = require('ws');
const P2P_PORT      = process.env.P2P_PORT || 5001;
const peers         = process.env.PEERS ? process.env.PEERS.split(',') : [];
const MESSAGE_TYPES = {
                        clearTransactions :'CLEAR_TRANSACTIONS',
                        transaction       :'TRANSACTION',
                        chain             :'CHAIN'
                      };



//            **** PEER-TO-PEER SERVER ****
//   This class uses Websockets to create a p2p network
//   that allows multiple users to interact with each other
//   by sending transactions and syncing the most recent 
//   versions of the blockchain and transaction pool
//   across all users.

class P2pServer {
  constructor(blockchain, transactionPool) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.sockets = [];
  }
  
  listen() {
    const server = new Websocket.Server({port: P2P_PORT});
    server.on('connection', socket => this.connectSocket(socket));
    this.connectToPeers();
    console.log(`Listening for peer-to-peer connections on ${P2P_PORT}`);
  }
  
  connectSocket(socket) {
    this.sockets.push(socket);
    console.log('Socket connected');
    this.messageHandler(socket);
    this.sendChain(socket);
  }
  
  connectToPeers() {
    peers.forEach(peer => {
      const socket = new Websocket(peer);
      socket.on('open', this.connectSocket(socket));
    });
  }
  
  messageHandler(socket) {
    socket.on('message', message => {
      const data = JSON.parse(message);
      switch(data.type) {
        case MESSAGE_TYPES.chain:
          this.blockchain.replaceChain(data.chain);
          break;
        case MESSAGE_TYPES.transaction:
          this.transactionPool.updateOrAddTransaction(data.transaction);
          break;
        case MESSAGE_TYPES.clearTransactions:
          this.transactionPool.clear();
          break;
      }
    });
  }
  
  sendChain(socket) {
    socket.send(JSON.stringify({
      type: MESSAGE_TYPES.chain,
      chain: this.blockchain.chain
    }));
  }
  
  sendTransaction(socket, transaction) {
    socket.send(JSON.stringify({
      type: MESSAGE_TYPES.transaction,
      transaction
    }));
  }
  
  syncChains() {
    this.sockets.forEach(socket => this.sendChain(socket));
  }
  
  broadcastTransaction(transaction) {
    this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
  }
  
  broadcastClearTransactions() {
    this.sockets.forEach(socket => socket.send(JSON.stringify({type: MESSAGE_TYPES.clearTransactions})));
  }
}

module.exports = P2pServer;