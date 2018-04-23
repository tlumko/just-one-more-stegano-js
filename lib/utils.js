const fs = require('fs');
const PNG = require('pngjs').PNG;
const read = require('read');
const inputType = require('./constants.js').inputType;

module.exports = {
  parseImage,
  parseInput,
  resolvePassword,
  random,
  padLeft,
};

function parseImage(img) {
  return new Promise((resolve) => {
    fs.createReadStream(img)
      .pipe(new PNG({}))
      .on('parsed', function() {
        resolve(this);
      });
  });
}

function parseInput(input, args) {
  return new Promise((resolve) => {
    fs.readFile(input, (err, data) => {
      if (err) {
        resolve({
          data: input,
          type: args.unicode ? inputType.unicode : inputType.ascii,
        });
        return;
      }
      resolve({
        name: input,
        type: inputType.hex,
        data: data.toString('hex')
      });
    });
  });
}

function resolvePassword(args) {
  return new Promise((resolve, reject) => {
    if (args.password) {
      read({
        prompt: 'password: ',
        silent: true,
        replace: '*',
      },
      (err, result) => {
        if (err) { return reject('smth wrong with password'); }
        resolve(result);
      });
    } else {
      resolve();
    }
  });
}

function random(from, to) {
  return from + Math.floor(Math.random() * (to - from + 1));
}

function padLeft(str, length, padString='0') {
  str = str.toString();
  let targetLength = length - str.length;

  if (targetLength <= 0) {
    return str;
  }

  return padString.repeat(targetLength) + str;
}