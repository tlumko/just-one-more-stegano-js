const settings = require('./settings');
const inputType = require('./constants.js').inputType;
const utils = require('./utils.js');
const binaryDerivantConverter = require('./converters/binary-derivant-converter.js');
const base64Converter = require('./converters/base64-converter.js');
const converter = {};

module.exports = {
  define,
  transformInput,
  transformOutput,
  decodeLength,
};

function define() {
  if (settings.system === 'base64') {
    Object.assign(converter, base64Converter);
  } else {
    Object.assign(converter, binaryDerivantConverter);
  }
}

function transformInput(input) {
  input.name = unicodeToHex(input.name);

  if (input.type === inputType.unicode) {
    input.data = unicodeToHex(input.data);
  }

  if (input.type === inputType.ascii) {
    input.data = asciiToHex(input.data);
  }

  input.data = converter.fromHex(input.data, settings.system);
  input.name = converter.fromHex(input.name, settings.system);
  input.dataLength = converter.encodeLength(input.data.length, settings.system);
  input.nameLength = converter.encodeLength(input.name.length, settings.system);

  return input.dataLength + input.nameLength +
    input.data + input.name;
}

function transformOutput(output, props) {
  output.name = converter.toHex(output.name, settings.system);
  output.name = hexToUnicode(output.name);
  output.data = converter.toHex(output.data, settings.system);

  if (props.ascii) {
    output.data = hexToAscii(output.data);
  }

  if (props.unicode) {
    output.data = hexToUnicode(output.data);
  }

  return output;
}

function decodeLength(matrix, background) {
  return converter.decodeLength(matrix, background);
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

function strToNum(str, systemBase, codeLength) {
  if (!str) { return; }
  let res = '';
  for(let i = 0; i < str.length; i++) {
    res += utils.padLeft(str.charCodeAt(i).toString(systemBase), codeLength);
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
