const fs = require('fs');
const PNG = require('pngjs').PNG;

module.exports = {
  parseImage,
  parseKey,
  strToHex,
  hexToStr,
};

function parseImage(img) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(img)
    .pipe(new PNG({}))
    .on('parsed', function() {
      resolve(this);
    });
  });
}

function parseKey(keyPath) {
  if (!keyPath) {return Promise.resolve(); } 

  return new Promise((resolve, reject) => {
    fs.readFile(keyPath, (err, data) => {
      if (err) {reject(err)}

      let key = keyService.parse(data);
      resolve(key);
    })
  });
}

function strToHex(str) {
  let hexStr = '';
  for(let i = 0; i < str.length; i++) {
    hexStr += str.charCodeAt(i).toString(16);
  }
  return hexStr;
}

function hexToStr(hexStr) {
  let index = 0;
  const hexArr = [];

  while(index < hexStr.length) {
    hexArr.push(hexStr[index] + hexStr[index+1]);
    index += 2;
  }

  let res = ''
  const decArr = hexArr.map(v => parseInt(v, 16));
  decArr.forEach(v => res += String.fromCharCode(v));
  return res;
}
