
/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');
const leveldb = require('./levelSandbox');
const Block = require('./block');






/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class BlockChain{
  constructor(){

    leveldb.getBlockHeight().then(count => {
      if (count === -1) {
        this.addBlock(
          new Block('this is the First block in the chain - Genesis block')
        ).then(() => console.log('genesis Block was not existed, but it\'s created now'))
      }
    })
  };



  // Add new block
  async addBlock(newBlock){

    let prevBlock;

    // Block height
    newBlock.height = (await this.getBlockHeight()) + 1;
    ;
    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    // previous block hash
    if(newBlock.height > 0){
      prevBlock = await this.getBlock(newBlock.height - 1);
      newBlock.previousBlockHash = prevBlock.hash;
    }
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();

   //presist/store newBlock within LevelDB
    await leveldb.addBlock(newBlock.height, JSON.stringify(newBlock))
  }

  // Get block height
   async getBlockHeight(){

      return  await leveldb.getBlockHeight();

     
    }

    // get block
    async getBlock(blockHeight){
      // return object as a single string
      return  JSON.parse(await leveldb.getBlock(blockHeight))
     
    }



    // validate block
    async validateBlock(blockHeight){
      // get block object
      let block = await this.getBlock(blockHeight);
      // get block hash
      let blockHash = block.hash;
      // remove block hash to test block integrity
      block.hash = '';
      // generate block hash
      let validBlockHash = SHA256(JSON.stringify(block)).toString();
      // Compare
      if (blockHash===validBlockHash) {
          return true;
        } else {
          console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
          return false;
        }
    }

   // Validate blockchain
    async validateChain(){
      let errorLog = [],
      previousHash = '',
      valid= false,
      chainLength = await this.getBlockHeight();

      for (let i = 0; i < chainLength; i++) {

        this.getBlock(i).then((block) => {
          valid = this.validateBlock(block.height)
  
          if (!valid || block.previousBlockHash !== previousHash) {
            errorLog.push(i)
          } 
        
          previousHash = block.hash   

      if (i === (chainLength -1)) {
      if (errorLog.length>0) {
        console.log('Block errors = ' + errorLog.length);
        console.log('Blocks: '+errorLog);
      } else {
        console.log('No errors detected');
         }
      }
    })
   }
 }

  
}





module.exports = BlockChain