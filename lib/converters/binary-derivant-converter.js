const utils = require('../utils.js');
const settings = require('../settings');

module.exports = {
  toHex,
  fromHex,
  encodeLength,
  decodeLength,
};

function encodeLength(length) {
  length = length.toString(16);

  if (length.length%2) {
    length = utils.padLeft(length, length.length+1);
  }

  let bytesQuantity = utils.padLeft(Math.ceil(length.length/2), 2);
  let encodedLength = bytesQuantity.toString(16) + length.toString(16);
  return fromHex(encodedLength, settings.system);
}

function toHex(num) {
  if (!num) { return ''; }

  const re = new RegExp(`.{1,${settings.byteLength}}`, 'g');
  return num
    .toString()
    .match(re)
    .map(n => utils.padLeft(parseInt(n, settings.base).toString(16), 2))
    .join('');
}

function fromHex(hex) {
  if (!hex) { return ''; }

  if (hex.length % 2) {
    hex = utils.padLeft(hex, hex.length+1);
  }

  return hex
    .toString()
    .match(/.{1,2}/g)
    .map(h => utils.padLeft(parseInt(h, 16).toString(settings.base), settings.byteLength))
    .join('');
}

function decodeLength(matrix, background) {
  let str = '';

  for(let i = 0; i < settings.byteLength; i++) {
    str += matrix[background.takeNext()][background.takeNext()];
  }

  let bytesQuantity = parseInt(str, settings.base);
  str = '';
  for(let i = 0; i < bytesQuantity * settings.byteLength; i++) {
    str += matrix[background.takeNext()][background.takeNext()];
  }

  return parseInt(toHex(str), 16);
}