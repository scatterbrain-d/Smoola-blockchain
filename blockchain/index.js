const Block = require('./block');

//                            **** BLOCKCHAIN ****
//
//   This class adds blocks to the local chain, ensures the chain is valid,
//   and replaces the public chain with the updated chain.
//
//   * addBlock - grabs the last block currently on the chain and uses it to
//   create a new block and add it to the chain.
//
//   * isValidChain - first ensures that the chain starts with a genesis block,
//   then compares each block's `lastHash` to the hash of the previous block over
//   the entire chain to confirm validity.
//
//   * replaceChain - checks to ensure new chain is longer than existing chain,
//   also runs validity check on new chain. If these checks pass, it replaces the
//   current chain with the new chain.


class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }
  
  
  addBlock(data) {
    const lastBlock = this.chain[this.chain.length-1];
    const block = Block.mineBlock(lastBlock, data);
    this.chain.push(block);
    return block;
  }
  
  
  isValidChain(chain) {
    if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) 
      return false;
    for(let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i-1];
      if(block.lastHash !== lastBlock.hash || block.hash !== Block.blockHash(block))
        return false;
    }
    return true;
  }
  
  
  replaceChain(newChain) {
    if (newChain.length <= this.chain.length) {
      console.log('Received chain is not longer than current chain.');
      return;
    } else if (!this.isValidChain(newChain)) {
      console.log('Received chain is not valid');
      return;
    }
    console.log('Updating blockchain with the new chain');
    this.chain = newChain;
  }
}

module.exports = Blockchain;