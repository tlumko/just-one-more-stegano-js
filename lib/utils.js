const fs = require('fs');
const PNG = require('pngjs').PNG;
const keyService = require('./key.service.js');

module.exports = {
  parseImage,
  parseKey,
  toString,
  fromStr,
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

function parseKey(keyPath, existingKey) {
  if (!keyPath) {return Promise.resolve(existingKey); }

  return new Promise((resolve, reject) => {
    fs.readFile(keyPath, (err, data) => {
      if (err) {reject(err)}
      let key = keyService.parse([...data]);
      resolve(key);
    })
  });
}

function toString(num, args) {
  return hexToStr(num);
}

function fromStr(str, args) {
  return strToHex(str);
}

function strToHex(str) {
  let hexStr = '';
  for(let i = 0; i < str.length; i++) {
    hexStr += str.charCodeAt(i).toString(16);
  }
  return hexStr;
}

function strToOct(str) {
  let octStr = '';
  for(let i = 0; i < str.length; i++) {
    octStr += padLeft(str.charCodeAt(i).toString(8), 3);
  }
  return octStr;
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

function octToStr(octStr) {
  let index = 0;
  const octArr = [];

  while(index < octStr.length) {
    octArr.push(octStr[index] + octStr[index+1] + octStr[index+2]);
    index += 3;
  }

  let res = ''
  const decArr = octArr.map(v => parseInt(v, 8));
  decArr.forEach(v => res += String.fromCharCode(v));
  return res;
}

function padLeft(str, length, padString='0') {
  let targetLength = length - str.length;
  if (targetLength <= 0) {
    return str;
  }
  return padString.repeat(targetLength) + str;
}
