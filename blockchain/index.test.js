const Blockchain = require('./index');
const Block = require('./block');

describe('Blockchain', () => {
  let bc, bc2;
  
  beforeEach(() => {
    bc = new Blockchain();
    bc2 = new Blockchain();
  });
  
  
  //testing constructor
  it('should start with genesis block', () => {
    expect(bc.chain[0]).toEqual(Block.genesis());
  });
  
  
  //testing addBlock function
  it('adds a new block', () => {
    const data = 'new';
    bc.addBlock(data);
    
    expect(bc.chain[bc.chain.length-1].data).toEqual(data);
  });
  
  
  //testing isValidChain function
  it('validates a valid chain', () => {
    bc2.addBlock('valid');
    
    expect(bc.isValidChain(bc2.chain)).toBe(true);
  });
  
  it('invalidates a chain with a corrupt genesis block', () => {
    bc2.chain[0] = 'corrupt';
    
    expect(bc.isValidChain(bc2.chain)).toBe(false);
  });
  
  it('invalidates a corrupt chain', () => {
    bc2.addBlock('valid');
    bc2.chain[1].data = 'invalid';
    
    expect(bc.isValidChain(bc2.chain)).toBe(false);
  });
  
  
  //testing replaceChain function
  it('replaces the chain with a valid chain', () => {
    bc2.addBlock('newBlock');
    bc.replaceChain(bc2.chain);
    
    expect(bc.chain).toEqual(bc2.chain);
  });
  
  it('does not replace the chain with one of equal or less length', () => {
    bc.addBlock('newBlock');
    bc.replaceChain(bc2.chain);
    
    expect(bc.chain).not.toEqual(bc2.chain);
  });
});


