


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



import Block from './simpleChain';
import Blockchain from './simpleChain';

const  block = new Block(),
blockchain = new Blockchain();



(function theLoop (i) {
    let myBlockblockchain=new Blockchain(),
    blockTest;
    setTimeout(function () {
         blockTest = new Block("Test Block - " + (i + 1));
        myBlockblockchain.addBlock(blockTest).then((result) => {
            console.log(result);
            i++;
            if (i < 10) theLoop(i);
        })
        
        .then((result)=>{
            reult.validateChain;
        });
    }, 10000);
  })(0);

