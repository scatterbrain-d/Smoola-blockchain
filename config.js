
/*                             **** CONFIG ****

   * INITIAL_BALANCE - balance of a newly created wallet.

   * MINING REWARD - amount of cryptocurrency sent to miner for solving
   proof of work to create a block.

   * DIFFICULTY - adjusts computational requirement for solving proof of work.
   For a given difficulty value, a user must generate a hash with that number of 
   leading zeroes using the SHA256 algorithm. Managed dynamically, but this provides
   an inital, default value.

   * MINE_RATE - desired time in ms between blocks added to the chain.
   The blockchain changes the difficulty value dynamically based on this value
   to ensure that the blockchain grows at the desired rate.
*/

const INITIAL_BALANCE = 500;
const MINING_REWARD   = 50;
const DIFFICULTY      = 4;
const MINE_RATE       = 3000;

module.exports = {DIFFICULTY, MINE_RATE, INITIAL_BALANCE, MINING_REWARD};