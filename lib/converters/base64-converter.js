const settings = require('../settings');
const utils = require('../utils.js');

const converter = {
  toHex,
  fromHex,
  encodeLength,
  decodeLength,
}

module.exports = getConverter;

function getConverter() {
  return converter;
}

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
  return fromHex(length.toString(16)) + settings.ETXChar;
}

function decodeLength(background) {
  
}
