const {DIFFICULTY, MINE_RATE} = require('../config');
const ChainUtil               = require('../chain-util');


//                        **** BLOCK ****
//
//   This class creates and manages the blocks on the blockchain.
//
//   * toString - returns block info to command line.
//
//   * genesis - creates a new genesis block, which must be used to
//   start a chain since all other blocks must connect to a preceding
//   block.
//
//   * mineBlock - creates a new block on the chain. Includes proof of work 
//   algorithm that keeps generating a hash until it meets number of leading 
//   zeroes specified by DIFFICULTY
//
//   * hash - calculation of a block's hash using all other block parameters
//
//   * blockhash - deconstructs block data and uses it to make a hash. Used to
//   compare to existing hash for blockchain validation. If data has been
//   altered on the block, chain is invalidated.
//
//   * adjustDifficulty - dynamically adjusts difficulty of proof of work by 
//   comparing actual mine rate to desired MINE_RATE


class Block {
  constructor(timestamp, lastHash, hash, data, nonce, difficulty){
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty || DIFFICULTY;
  }
  
  toString() {
    return `Block -
    Timestamp: ${this.timestamp}
    Last Hash: ${this.lastHash.substring(0, 10)}
    Hash:      ${this.hash.substring(0,10)}
    Nonce:     ${this.nonce}
    Difficulty:${this.difficulty}
    Data:      ${this.data}`;
  }
  
  static genesis() {
    return new this('beginning', 'none', 'let there be block', [], 0, DIFFICULTY);
  }
  
  static mineBlock(lastBlock, data) {
    let hash, timestamp;
    let nonce = 0;
    let {difficulty} = lastBlock;
    const lastHash = lastBlock.hash;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty(lastBlock, timestamp);
      hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
    } while(hash.substring(0, difficulty) !== '0'.repeat(difficulty));
    
    return new this(timestamp, lastHash, hash, data, nonce, difficulty);
  }
  
  
  static hash(timestamp, lastHash, data, nonce, difficulty) {
    return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
  }
  
  static blockHash(block) {
    const {timestamp, lastHash, data, nonce, difficulty} = block;
    return Block.hash(timestamp, lastHash, data, nonce, difficulty);
  }
  
  
  static adjustDifficulty(lastBlock, currentTime) {
    let {difficulty} = lastBlock;
    difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
    return difficulty;
  }
}

module.exports = Block;