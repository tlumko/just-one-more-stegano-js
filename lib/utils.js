const fs = require('fs');
const PNG = require('pngjs').PNG;
const read = require("read");

const defaults = require('./defaults.js');
const inputType = require('./constants.js').inputType;

module.exports = {
  parseImage,
  parseInput,
  resolvePassword,
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

function parseInput(input, args) {
  return new Promise((resolve, reject) => {
    fs.readFile(input, (err, data) => {
      if (err) {
        resolve({
          data: input,
          type: args.unicode ? inputType.unicode : inputType.ascii,
        });
        return;
      }
      console.log(data);
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

function random(from, to) {
  return from + Math.floor(Math.random() * (to - from + 1));
}
