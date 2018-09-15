/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');
const leveldb = require('./levelSandbox')


/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block{
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

export class Blockchain{
  constructor(){

    leveldb.getBlockHeight().then(num => {
      if (num === 0) {
        this.addBlock(
          new Block('this is the First block in the chain - Genesis block')
        ).then(() => console.log('genesis Block was not exist, but created now'))
      }
    })
  }



  // Add new block
  async addBlock(newBlock){

    let prevBlock;

    // Block height
    newBlock.height = await getBlockHeight();
    ;
    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    // previous block hash
    if(newBlock.height > 0){
      prevBlock = await leveldb.getBlock(newBlock.height - 1);
      newBlock.previousBlockHash = prevBlock.hash;
    }
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();

//presist/store newBlock within LevelDB
    await leveldb.addBlock(newBlock.height, JSON.stringify(newBlock))
  }

  // Get block height
    getBlockHeight(){

      return await leveldb.getBlockHeight()
     
    }

    // get block
    getBlock(blockHeight){
      // return object as a single string
      return  await leveldb.getBlock(blockHeight)

     // return JSON.parse(JSON.stringify(this.chain[blockHeight]));
    }


    

    // validate block
    async validateBlock(blockHeight){
      // get block object
      let block = this.getBlock(blockHeight);
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
      chain=[],
      chainLength = await this.getBlockHeight();

      for (var i = 0; i < this.chainLength-1; i++) {
        // validate block
        if (!this.validateBlock(i))errorLog.push(i);
        // compare blocks hash link
        let blockHash = this.chain[i].hash;
        let previousHash = this.chain[i+1].previousBlockHash;
        if (blockHash!==previousHash) {
          errorLog.push(i);
        }
      }
      if (errorLog.length>0) {
        console.log('Block errors = ' + errorLog.length);
        console.log('Blocks: '+errorLog);
      } else {
        console.log('No errors detected');
      }
    }
}
