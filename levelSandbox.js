/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/


const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);


module.exports = {

// Add data to levelDB with key/value pair
addLevelDBData: (key,value)=>{
  db.put(key, value, function(err) {
    if (err) return console.log('Block ' + key + ' submission failed', err);
  })
},

// Get data from levelDB with key
  getLevelDBData: (key)=>{
  db.get(key, function(err, value) {
    if (err) return console.log('Not found!', err);
    console.log('Value = ' + value);
  })
},

// Add data to levelDB with value
  addDataToLevelDB: (value)=> {
    let i = 0;
    db.createReadStream().on('data', function(data) {
          i++;
        }).on('error', function(err) {
            return console.log('Unable to read data stream!', err)
        }).on('close', function() {
          console.log('Block #' + i);
          addLevelDBData(i, value);
        });
},


  addBlock: (key, value) => {
  return new Promise((resolve, reject) => {
    db.put(key, value, error => {
      if (error) reject(error)
      console.log(`Added block # ${key}`)
      resolve('Added block #' + key)
    })
  })
},

 getBlock:  key => {
  return new Promise((resolve, reject) => {
    db.get(key, (error, value) => {
      if (error) reject(error)
      resolve(value)
    })
  })
},

 getBlockHeight: () => {
  return new Promise((resolve, reject) => {
    let height = -1
    db.createReadStream()
      .on('data', data => {
        height++
      })
      .on('error', error => {
        reject(error)
      })
      .on('close', () => {
        resolve(height)
      })
  })
},

}







