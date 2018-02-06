const _ = require('lodash');

const defaultKey = [
  ['0', '1', '2', '3', ],
  ['4', '5', '6', '7', ],
  ['8', '9', 'a', 'b', ],
  ['c', 'd', 'e', 'f', ],
];

module.exports = {
  generate,
  compact,
  parse,
  defaultKey
};

function generate(args) {
  let i = 0;
  const chunkSize = 4;
  const seedKey = defaultKey;
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

  return key;
}

function parse(key) {
  key = key.map(v => String.fromCharCode(v));
  return _.chunk(key, 256);
}

function compact(key) {
  return _.flatten(key).join('');
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