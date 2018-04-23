const settings = require('../settings');
const utils = require('../utils.js');

module.exports = {
  toHex,
  fromHex,
  encodeLength,
  decodeLength,
};

function toHex(str) {
  if (!str) { return ''; }

  return new Buffer(str, 'base64').toString('hex');
}

function fromHex(hex) {
  if (!hex) { return ''; }

  if (hex.length % 2) {
    hex = utils.padLeft(hex, hex.length+1);
  }

  return new Buffer(hex, 'hex').toString('base64');
}

function encodeLength(length) {
  return fromHex(length.toString(16)) + settings.ETX;
}

function decodeLength(matrix, background) {
  let str = '';

  while(!endOfText(str)) {
    str += matrix[background.takeNext()][background.takeNext()];
  }
  str = str.slice(0, 0 - settings.ETX.length);

  return parseInt(toHex(str), 16);
}

function endOfText(str) {
  return str.slice(0 - settings.ETX.length) === settings.ETX;
}