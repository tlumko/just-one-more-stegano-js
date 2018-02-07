const fs = require('fs');
const PNG = require('pngjs').PNG;
const keyService = require('./key.service.js');
const defaults = require('./defaults.js');

module.exports = {
  parseImage,
  parseKey,
  toString,
  fromStr,
  padLeft,
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

function toString(hex) {
  var string = '';
  for (var i = 0; i < hex.length; i += defaults.codeLength) {
    string += String.fromCharCode(parseInt(hex.substr(i, defaults.codeLength), defaults.base));
  }
  return string;
}

function fromStr(str) {
  let res = '';
  for(let i = 0; i < str.length; i++) {
    res += padLeft(str.charCodeAt(i).toString(defaults.base), defaults.codeLength);
  }
  return res;
}

function padLeft(str, length, padString='0') {
  let targetLength = length - str.length;
  if (targetLength <= 0) {
    return str;
  }
  return padString.repeat(targetLength) + str;
}
