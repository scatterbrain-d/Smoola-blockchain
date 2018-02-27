const ChainUtil = require('../chain-util');
const {DIFFICULTY, MINE_RATE} = require('../config');

class Block {
  constructor(timestamp, lastHash, hash, data, nonce, difficulty){
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty || DIFFICULTY;
  }
  
  //returns block info to command line
  toString() {
    return `Block -
    Timestamp: ${this.timestamp}
    Last Hash: ${this.lastHash.substring(0, 10)}
    Hash:      ${this.hash.substring(0,10)}
    Nonce:     ${this.nonce}
    Difficulty:${this.difficulty}
    Data:      ${this.data}`;
  }
  
  //creates genesis block. Static so can be used without creating new Block instance
  static genesis() {
    return new this('beginning', 'none', 'let there be block', [], 0, DIFFICULTY);
  }
  
  static mineBlock(lastBlock, data) {
    let hash, timestamp;
    let nonce = 0;
    let {difficulty} = lastBlock;
    const lastHash = lastBlock.hash;
    
    //proof of work - keeps generating hash until it meets number of leading zeroes specified by DIFFICULTY
    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty(lastBlock, timestamp);
      hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
    } while(hash.substring(0, difficulty) !== '0'.repeat(difficulty));
    
    return new this(timestamp, lastHash, hash, data, nonce, difficulty);
  }
  
  //calculation of the hash using all other parameters
  static hash(timestamp, lastHash, data, nonce, difficulty) {
    return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
  }
  
  static blockHash(block) {
    const {timestamp, lastHash, data, nonce, difficulty} = block;
    return Block.hash(timestamp, lastHash, data, nonce, difficulty);
  }
  
  //dynamically adjusts difficulty of proof of work by comparing actual mine rate to desired MINE_RATE
  static adjustDifficulty(lastBlock, currentTime) {
    let {difficulty} = lastBlock;
    difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
    return difficulty;
  }
}

module.exports = Block;