const TransactionPool = require('../wallet/transaction-pool');
const bodyParser      = require('body-parser');
const Blockchain      = require('../blockchain');
const P2pServer       = require('./p2p-server');
const express         = require('express');
const Wallet          = require('../wallet');
const Miner           = require('./miner');

const HTTP_PORT = process.env.HTTP_PORT || 3001;
const app       = express();
const wallet    = new Wallet();
const bc        = new Blockchain();
const tPool     = new TransactionPool();
const p2pServer = new P2pServer(bc, tPool);
const miner     = new Miner(bc, tPool, wallet, p2pServer);

app.use(bodyParser.json());

//                 **** GET ROUTES ****
//
//   /blocks - displays the blockchain
//
//   /transactions - displays current transactions in the pool 
//
//   /public-key - exposes a user's public address
//
//   /mine-transactions - adds a block to the blockchain,
//    clears transactions, and broadcasts the new blockchain
//    and empty transaction pool to all other users

app.get('/blocks', (req, res) => {
  res.json(bc.chain);
});


app.get('/transactions', (req, res) => {
  res.json(tPool.transactions);
});


app.get('./public-key', (req, res) => {
  res.json({publicKey: wallet.publicKey});
});


app.get('./mine-transactions', (req, res) => {
  const block = miner.mine();
  console.log(`New block added: ${block.toString()}`);
  res.redirect('/blocks');
});


//               **** POST ROUTES ****
//
//   /transact creates a transaction, places it in the pool,
//    and updates the pool across all connected users
//
//   /mine adds a block containing requested data and
//    syncs the new blockchain over all users (more
//    generic than /mine-transactions which can only make
//    blocks that store cyptocurrency transactions)

app.post('/transact', (req, res) => {
  const {recipient, amount} = req.body;
  const transaction = wallet.createTransaction(recipient, amount, bc, tPool);
  p2pServer.broadcastTransaction(transaction);
  res.redirect('/transactions');
});


app.post('/mine', (req, res) => {
  const block = bc.addBlock(req.body.data);
  console.log(`new block added: ${block.toString()}`);
  p2pServer.syncChains();
  res.redirect('/blocks');
});


app.listen(HTTP_PORT, () => {
  console.log(`Blockchain server running`);
});


p2pServer.listen();