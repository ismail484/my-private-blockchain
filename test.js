


/* ===== Testing ==============================================================|
|  - Self-invoking function to add blocks to chain                             |
|  - Learn more:                                                               |
|   https://scottiestech.info/2014/07/01/javascript-fun-looping-with-a-delay/  |
|                                                                              |
|  * 100 Milliseconds loop = 36,000 blocks per hour                            |
|     (13.89 hours for 500,000 blocks)                                         |
|    Bitcoin blockchain adds 8640 blocks per day                               |
|     ( new block every 10 minutes )                                           |
|  ===========================================================================*/


const BlockChain = require('./simpleChain');
const Block= require('./block');



let myBlockChain=new BlockChain();



(function theLoop (i) {
   let blockTest;
    setTimeout(function () {
         blockTest = new Block("Test Block - " + (i + 1));
        myBlockChain.addBlock(blockTest).then(() => {
            i++;
            if (i < 10000) theLoop(i);
        })
        
    }, 100);
    
  })(0);
  
  //check validaton
  setTimeout(function(){
    myBlockChain.validateChain();
},200000) ;


//test to get vaildation error
setTimeout(function(){
let inducedErrorBlocks = [98,99,100];
for (var i = 0; i < 3; i++) {
    myBlockChain.getBlock(inducedErrorBlocks[i]).data='induced chain error';
}
},4000)

setTimeout(function(){
    myBlockChain.validateChain();
},2000) 