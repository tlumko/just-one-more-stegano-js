const fs = require('fs');
const PNG = require('pngjs').PNG;
const read = require("read");

const keyService = require('./key.service.js');
const defaults = require('./defaults.js');

module.exports = {
  parseImage,
  resolvePassword,
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

function toString(hex) {
  if (defaults.system === 'base64') {
    return new Buffer(hex, 'base64').toString('ascii');
  }

  var string = '';
  for (var i = 0; i < hex.length; i += defaults.codeLength) {
    string += String.fromCharCode(parseInt(hex.substr(i, defaults.codeLength), defaults.base));
  }
  return string;
}

function fromStr(str) {
  if (defaults.system === 'base64') {
    return new Buffer(str).toString('base64');
  }

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
