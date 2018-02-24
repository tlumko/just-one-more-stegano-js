///todo: refactor
const fs = require('fs');
const _ = require('lodash');

const keyService = require('./key.service.js');
const matrixService = require('./matrix.service.js');
const propsService = require('./properties.service.js');
const backgroundService = require('./background.service.js');
const utils = require('./utils.js');
const settings = require('./settings.js');
const convertService = require('./convert.service.js');
const inputType = require('./constants.js').inputType;
const systems = require('./constants.js').systems;

module.exports = parse;

function parse(image, args) {
  Promise.all([
    resolveBackgroundAndProps(image, args),
    keyService.parse(args.key),
  ])
  .then(([[background, props], key]) => {
    const matrix = matrixService.create(key);

    let str = '';
    let output = {};

    for(let i = 0; i < settings.byteLength; i++) {
      str += matrix[background.takeNext()][background.takeNext()];
    }

    output.dataLengthBytes = parseInt(str, settings.base);
    str = '';

    for(let i = 0; i < output.dataLengthBytes * settings.byteLength; i++) {
      str += matrix[background.takeNext()][background.takeNext()];
    }

    output.dataLength = parseInt(str, settings.base);
    str = '';

    for(let i = 0; i < settings.byteLength; i++) {
      str += matrix[background.takeNext()][background.takeNext()];
    }

    output.nameLengthBytes = parseInt(str, settings.base);
    str = '';

    for(let i = 0; i < output.nameLengthBytes * settings.byteLength; i++) {
      str += matrix[background.takeNext()][background.takeNext()];
    }

    output.nameLength = parseInt(str, settings.base);
    str = '';

    [['dataLength', 'data'], ['nameLength', 'name']].forEach(a => {
      while (str.length < output[a[0]]) {
        str += matrix[background.takeNext()][background.takeNext()];
      }
      output[a[1]] = str;
      str = '';
    });

    return convertService.transformOutput(output, props);
  })
  .then(output => {
    console.log(output);
    if (!output.name) {
      console.log(output.data);
      return output.data;
    }

    const stream = fs.createWriteStream(output.name);
    stream.write(new Buffer(output.data, 'hex'));
    stream.end();
    console.log(`check the file ${output.name}`);
  })
  .catch(err => {
    console.log('oops', err)
  });
}

function resolveBackgroundAndProps(image, args) {
  return utils
    .parseImage(image)
    .then(png => backgroundService.init(png.data))
    .then(background => [background, propsService.decode(background)])
    .then(([background, props]) => {
      return utils
        .resolvePassword(props)
        .then(props => [background, props]);
    })
    .then(([background, props]) => {
      background.setup(Object.assign(args, props));
      return [background, props];
    });
}

function endOfText(str) {
  const re = new RegExp(`.{1,${settings.ETXChar.length}}`, 'g');
  const chunks = str.match(re);
  return chunks.pop() === settings.ETXChar;
}
