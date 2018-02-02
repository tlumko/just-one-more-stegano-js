const _ = require('lodash');

const defaultKey = [
  ['0', '1', '2', '3', ],
  ['4', '5', '6', '7', ],
  ['8', '9', 'a', 'b', ],
  ['c', 'd', 'e', 'f', ],
];

module.exports = {
  createMatrix,
  generateKey
};

function createMatrix(key) {
  key = key || defaultKey;
  const keyHeight = key.length;
  const keyWidth = key[0].length;
  const matrix = [];

  for (let i = 0; i < 256; i++) {
    if (!matrix[i]) { matrix[i] = [] }

    for (let j = 0; j < 256; j++) {
      matrix[i][j] = key[i%keyHeight][j%keyWidth];
    }
  }

  return matrix;
}

function generateKey() {
  let i = 0;
  const seedArr = _.flatten(defaultKey);
  const key = [];

  while (i < 256) {
    let keyPart = Object.assign([], _.chunk(shuffleArr(seedArr), 4));

    if (key[i] && key[i].length >= 256) {
      i += 4;
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