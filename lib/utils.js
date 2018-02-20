const fs = require('fs');
const PNG = require('pngjs').PNG;
const read = require("read");

const defaults = require('./defaults.js');
const inputType = require('./constatns.js').inputType;

module.exports = {
  parseImage,
  parseInput,
  resolvePassword,
  toString,
  fromStr,
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
    // if (args.unicode) {
    //   input = utils.strToNum(input, 16, 4);
    // }

    // const inputData = utils.fromStr(input, args) + defaults.ETXChar;

  if (input.type === inputType.unicode) {
    input.data = unicodeToHex(input.data);
    input.name = unicodeToHex(input.name);
  }

  if (input.type === inputType.ascii) {
    input.data = asciiToHex(input.data);
    input.name = asciiToHex(input.name);
  }

}

function transformOutput() {

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


function toString(num) {
  if (defaults.system === 'ascii') { return num; }

  if (defaults.system === 'base64') {
    return new Buffer(num, 'base64').toString('ascii');
  }

  return numToStr(num, defaults.base, defaults.codeLength);
}

function fromStr(str) {

  if (defaults.system === 'ascii') { return str; }

  if (defaults.system === 'base64') {
    return new Buffer(str).toString('base64');
  }

  return strToNum(str, defaults.base, defaults.codeLength);
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
  if (!str) { return; }
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

function convert(num) {
  return {
    from: (from) => {
      return {
        to: (to) => {
          return parseInt(num, from).toString(to);
        }
      }
    }
  }
}

function random(from, to) {
  return from + Math.floor(Math.random() * (to - from + 1));
}
