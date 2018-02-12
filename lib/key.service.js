const fs = require('fs');
const _ = require('lodash');

const defaults = require('./defaults.js');

module.exports = {
  write,
  generate,
  parse,
};

function generate(args) {
  let i = 0;
  const seedKey = defaults.key;
  const chunkSize = seedKey[0].length;
  const seedArr = _.flatten(seedKey);
  const key = [];

  while (i < 256) {
    let keyPart = Object.assign([], _.chunk(shuffleArr(seedArr), chunkSize));

    if (key[i] && key[i].length >= 256) {
      i += chunkSize;
    }

    keyPart.forEach((val, index) => {
      if (!key[i + index]) {
        key[i + index] = [];
      }

      key[i + index] = key[i + index].concat(val);
    });
  }

  key.length = 256;
  key.forEach(k => k.length = 256);

  return key;
}

function parse(keyPath, existingKey) {
  if (!keyPath) {return Promise.resolve(existingKey); }

  return new Promise((resolve, reject) => {
    fs.readFile(keyPath, (err, data) => {
      if (err) {reject(err)}
      let key = transform([...data]);
      resolve(key);
    })
  });
}

function write(key) {
  const stream = fs.createWriteStream('key');

  key.forEach(k => {
    stream.write(k.join(''));
  });

  stream.end();
}

function transform(key) {
  key = key.map(v => String.fromCharCode(v));
  return _.chunk(key, 256);
}

function shuffleArr(arr) {
  for(let i = 0; i < arr.length-1; i++) {
    let r = random(i, arr.length-1);
    [arr[i], arr[r]] = [arr[r], arr[i]];
  }
  return arr;
}

function random(from, to) {
  return from + Math.floor(Math.random() * (to - from + 1));
}