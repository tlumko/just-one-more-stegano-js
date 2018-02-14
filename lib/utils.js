const fs = require('fs');
const PNG = require('pngjs').PNG;
const read = require("read");

const defaults = require('./defaults.js');

module.exports = {
  parseImage,
  resolvePassword,
  toString,
  fromStr,
  strToNum,
  numToStr,
  random,
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

function resolvePassword(args) {
  return new Promise((resolve, reject) => {
    if (args.password) {
      read({
          prompt: 'password: ',
          silent: true,
          replace: '~',
        },
        (err, result) => {
          if (err) { return reject('smth wrong with password'); }

          args.password = result;
          resolve(args);
        }
      );
    } else {
      args.password = undefined;
      resolve(args);
    }
  });
}

function toString(num) {
  if (defaults.system === 'ascii') { return num; }

  if (defaults.system === 'base64') {
    return new Buffer(num, 'base64').toString('ascii');
  }

  return numToStr(num, defaults.base, defaults.codeLength);
}

function fromStr(str) {
  str = str.toString();

  if (defaults.system === 'ascii') { return str; }

  if (defaults.system === 'base64') {
    return new Buffer(str).toString('base64');
  }

  return strToNum(str, defaults.base, defaults.codeLength);
}

function strToNum(str, systemBase, codeLength) {
  let res = '';
  for(let i = 0; i < str.length; i++) {
    res += padLeft(str.charCodeAt(i).toString(systemBase), codeLength);
  }
  return res;
}

function numToStr(num, systemBase, codeLength) {
  let string = '';
  for (let i = 0; i < num.length; i += codeLength) {
    string += String.fromCharCode(parseInt(num.substr(i, codeLength), systemBase));
  }
  return string;
}

function random(from, to) {
  return from + Math.floor(Math.random() * (to - from + 1));
}

function padLeft(str, length, padString='0') {
  let targetLength = length - str.length;
  if (targetLength <= 0) {
    return str;
  }
  return padString.repeat(targetLength) + str;
}
