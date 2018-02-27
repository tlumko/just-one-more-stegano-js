const settings = require('./settings');
const inputType = require('./constants.js').inputType;
const systems = require('./constants.js').systems;

const transformer = {}

const aliquot2Transformer = {
  toHex: aliquot2ToHex,
}

module.exports = {
  transformInput,
  transformOutput,
  toDec,
};

function define(system) {
  Object.assign(transformer, aliquot2Transformer);
}

function transformInput(input) {
  input.name = unicodeToHex(input.name);

  if (input.type === inputType.unicode) {
    input.data = unicodeToHex(input.data);
  }

  if (input.type === inputType.ascii) {
    input.data = asciiToHex(input.data);
  }

  input.data = fromHex(input.data, settings.system);
  input.name = fromHex(input.name, settings.system);

  input.dataLength = encodeLength(input.data.length, settings.system);
  input.nameLength = encodeLength(input.name.length, settings.system);

  return input.dataLength + input.nameLength +
    input.data + input.name;
}

function transformOutput(output, props) {
  output.data = toHex(output.data, settings.system);
  output.name = toHex(output.name, settings.system);
  output.name = hexToUnicode(output.name);

  if (props.ascii) {
    output.data = hexToAscii(output.data);
  }

  if (props.unicode) {
    output.data = hexToUnicode(output.data);
  }

  return output;
}

function encodeLength(length) {
  length = length.toString(16);

  if (length.length%2) {
    length = padLeft(length, length.length+1);
  }

  let bytesQuantity = padLeft(Math.ceil(length.length/2), 2);
  let encodedLength = bytesQuantity.toString(16) + length.toString(16);

  return fromHex(encodedLength, settings.system);
}

function fromDec(num, system) {
  return fromHex(num.toString(16), system)
}

function toDec(num, system) {
  return parseInt(toHex(num, system), 16);
}

function asciiToHex(str) {
  return strToNum(str, 16, 2);
}

function unicodeToHex(str) {
  return strToNum(str, 16, 4);
}

function hexToAscii(hex) {
  return numToStr(hex, 16, 2);
}

function hexToUnicode(hex) {
  return numToStr(hex, 16, 4);
}

function base64ToHex(str) {
  return new Buffer(str, 'base64').toString('hex');
}

function hexToBase64(hex) {
  return new Buffer(hex, 'hex').toString('base64');
}

function aliquot2ToHex(str) {

}

function hexToaliquot2(hex) {

}

function fromHex(hex, system, ) {
  if (!hex) { return ''; }

  if (hex.length % 2) {
    hex = padLeft(hex, hex.length+1);
  }

  if (system === 'base64') {
    return hexToBase64(hex);
  }

  return hex
    .toString()
    .match(/.{1,2}/g)
    .map(h => padLeft(parseInt(h, 16).toString(systems[system].base), systems[system].byteLength))
    .join('');
}


function toHex(num, system, ) {
  if (!num) { return ''; }

  if (system === 'base64') {
    return base64ToHex(num);
  }

  const re = new RegExp(`.{1,${systems[system].byteLength}}`, 'g');
  return num
    .toString()
    .match(re)
    .map(n => padLeft(parseInt(n, systems[system].base).toString(16), 2))
    .join('');
}

function strToNum(str, systemBase, codeLength) {
  if (!str) { return; }

  let res = '';
  for(let i = 0; i < str.length; i++) {
    res += padLeft(str.charCodeAt(i).toString(systemBase), codeLength);
  }
  return res;
}

function numToStr(num, systemBase, codeLength) {
  if (!num) { return; }
  let string = '';
  for (let i = 0; i < num.length; i += codeLength) {
    string += String.fromCharCode(parseInt(num.substr(i, codeLength), systemBase));
  }
  return string;
}

function padLeft(str, length, padString='0') {
  str = str.toString();
  let targetLength = length - str.length;
  if (targetLength <= 0) {
    return str;
  }
  return padString.repeat(targetLength) + str;
}