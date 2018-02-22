const Block = require('./block');

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }
  
  addBlock(data) {
    //grabs last block currently on the chain
    const lastBlock = this.chain[this.chain.length-1];
    
    //uses last block to create a new one with data entered in the argument above
    const block = Block.mineBlock(lastBlock, data);
    
    //add to chain
    this.chain.push(block);
    
    return block;
  }
  
  isValidChain(chain) {
    //must start with genesis block
    if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) 
      return false;
    
    //for entire chain, compare lastHash to hash of previous block to ensure chain is valid
    for(let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i-1];
      
      if(block.lastHash !== lastBlock.hash || block.hash !== Block.blockHash(block))
        return false;
      
    }
    return true;
  }
  
  replaceChain(newChain) {
    //new chain must be longer, otherwise is likely the same chain
    if (newChain.length <= this.chain.length) {
      console.log('Received chain is not longer than current chain.');
      return;
    //new chain must also be validated before replacing old chain
    } else if (!this.isValidChain(newChain)) {
      console.log('Received chain is not valid');
      return;
    }
    
    console.log('Updating blockchain with the new chain');
    this.chain = newChain;
  }
}

module.exports = Blockchain;