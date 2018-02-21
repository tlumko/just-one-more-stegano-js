const fs = require('fs');
const PNG = require('pngjs').PNG;
const read = require("read");

const defaults = require('./defaults.js');
const inputType = require('./constants.js').inputType;

module.exports = {
  parseImage,
  parseInput,
  resolvePassword,
  transformInput,
  transformOutput,
  strToNum,
  numToStr,
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

      resolve({
        name: input,
        type: inputType.hex,
        data
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

function transformInput(input) {
  if (input.type === inputType.unicode) {
    input.data = unicodeToHex(input.data);
    input.name = unicodeToHex(input.name);
  }

  if (input.type === inputType.ascii) {
    input.data = asciiToHex(input.data);
    input.name = asciiToHex(input.name);
  }

  if (defaults.system === 'base64') {
    input.data = hexToBase64(input.data);
    input.name = hexToBase64(input.name);
  } else {
    input.data = fromHex(input.data, defaults.base);
    input.name = fromHex(input.name, defaults.base);
  }

  return input.data + defaults.ETXChar + input.name + defaults.ETXChar;
}

function transformOutput(output, props) {
  output.data = toHex(output.data, defaults.base);
  output.name = toHex(output.name, defaults.base);

  if (props.ascii) {
    output.data = hexToAscii(output.data);
    output.name = hexToAscii(output.name);
  }

  if (props.unicode) {
    output.data = hexToUnicode(output.data);
    output.name = hexToUnicode(output.name);
  }

  return output;
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

const byteSizes = {
  16: 2,
  8: 3,
  4: 4,
  2: 8
};

function fromHex(hex, system, ) {
  if (!hex) { return ''; }

  return hex
    .toString()
    .match(/.{1,2}/g)
    .map(h => padLeft(parseInt(h, 16).toString(system), byteSizes[system]))
    .join('');
}


function toHex(num, system) {
  if (!num) { return ''; }

  const re = new RegExp(`.{1,${byteSizes[system]}}`, 'g');
  return num
    .toString()
    .match(re)
    .map(n => padLeft(parseInt(n, system).toString(16), 2))
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
  let targetLength = length - str.length;
  if (targetLength <= 0) {
    return str;
  }
  return padString.repeat(targetLength) + str;
}

function random(from, to) {
  return from + Math.floor(Math.random() * (to - from + 1));
}
