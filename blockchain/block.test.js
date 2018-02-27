const Block = require('./block');

describe('Block', () => {
  
  let data, block, lastBlock;
  
  
  beforeEach(() => {
    data = 'fakeblock';
    lastBlock = Block.genesis();
    block = Block.mineBlock(lastBlock, data);
  });
  
  
  //testing block creation
  it('sets the `data` to match the input', () => {
    expect(block.data).toEqual(data);
  });
  
  it('sets the `lastHash` to match the hash of the last block', () => {
    expect(block.lastHash).toEqual(lastBlock.hash);
  });
  
  
  //testing proof of work & nonce
  it('generates a hash that matches the difficulty', () => {
    expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
  });
  
  
  //testing method to dynamically set difficulty based on mine rate
  it('lowers the difficulty after a slowly mined block', () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 360000)).toEqual(block.difficulty - 1);
  });
  
  it('raises the difficulty after a quickly mined block', () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 1)).toEqual(block.difficulty + 1);
  });
  
})