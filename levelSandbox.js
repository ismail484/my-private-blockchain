/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

// Add data to levelDB with key/value pair
function addLevelDBData(key,value){
  db.put(key, value, function(err) {
    if (err) return console.log('Block ' + key + ' submission failed', err);
  })
}

// Get data from levelDB with key
function getLevelDBData(key){
  db.get(key, function(err, value) {
    if (err) return console.log('Not found!', err);
    console.log('Value = ' + value);
  })
}

// Add data to levelDB with value
function addDataToLevelDB(value) {
    let i = 0;
    db.createReadStream().on('data', function(data) {
          i++;
        }).on('error', function(err) {
            return console.log('Unable to read data stream!', err)
        }).on('close', function() {
          console.log('Block #' + i);
          addLevelDBData(i, value);
        });
}


const addBlock= (key, value) => {
  return new Promise((resolve, reject) => {
    db.put(key, value, err => {
      if (err) reject(err)
      resolve('Added block #' + key)
    })
  })
};

const getBlock= key => {
  return new Promise((resolve, reject) => {
    db.get(key, (err, value) => {
      if (err) reject(err)
      resolve(JSON.parse(value))
    })
  })
};

const getBlockHeight= () => {
  return new Promise((resolve, reject) => {
    let height = 0
    db.createReadStream()
      .on('data', data => {
        height++
      })
      .on('error', err => {
        reject(err)
      })
      .on('close', () => {
        resolve(height)
      })
  })
};


module.exports = {
  addBlock,
  getBlock,
  getBlockHeight,
  getBlockStream,
}







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


(function theLoop (i) {
  setTimeout(function () {
    addDataToLevelDB('Testing data');
    if (--i) theLoop(i);
  }, 100);
})(10);
