const utils = require('./utils.js');

const inputType = {
  hex: 'hex',
  ascii: 'ascii',
  unicode: 'unicode',
};

const systems = {
  'base16': {
    system: 'base16',
    base: 16,
    byteLength: 2,
    key: generateKey('0123456789abcdef', 4)
  },
  'base8': {
    system: 'base8',
    base: 8,
    byteLength: 3,
    key: generateKey('01234567', 3)
  },
  'base4': {
    system: 'base4',
    base: 4,
    byteLength: 4,
    key: generateKey('0123', 2)
  },
  'base2': {
    system: 'base2',
    base: 2,
    byteLength: 8,
    key: generateKey('01', 2)
  },
  'base64': {
    system: 'base64',
    base: 64,
    ETX: 'Aw==',
    key: generateKey('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=', 9)
  },
  'base256': {
    system: 'base256',
    base: 256,
    key: generateKey(genereateBase256Seed(), 16)
  }
};

module.exports = {
  inputType,
  systems,
};

function generateKey(seed, size) {
  const key = [];

  for(let i = 0; i < size; i++) {
    key[i] = [];

    for(let j = 0; j < size; j++) {
      let pos = i * size + j;
      pos = pos%seed.length;
      key[i][j] = seed[pos]
    }
  }

  return key;
}

function genereateBase256Seed() {
  const seed = [];
  for(let i = 0; i < 256; i++) {
    seed.push(utils.padLeft(i.toString(16), 2));
  }
  return seed;
}