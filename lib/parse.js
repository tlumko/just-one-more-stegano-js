///todo: refactor
const fs = require('fs');
const _ = require('lodash');

const keyService = require('./key.service.js');
const matrixService = require('./matrix.service.js');
const propsService = require('./properties.service.js');
const backgroundService = require('./background.service.js');
const utils = require('./utils.js');
const defaults = require('./defaults.js');
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

    while (_.isUndefined(output.name) || _.isUndefined(output.data)) {
      str += matrix[background.takeNext()][background.takeNext()];
      if (endOfText(str)) {
        str = str.slice(0, 0-defaults.ETXChar.length); //remove terminator char
        if (output.data) {
          output.name = str;
        } else {
          output.data = str;
        }
        str = '';
      }
    }

    return convertService.transformOutput(output, props);
  })
  .then(output => {
    if (!output.name) {
      console.log(output.data);
      return output.data;
    }

    const stream = fs.createWriteStream(output.name);
    stream.write(output.data);
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
  const re = new RegExp(`.{1,${defaults.ETXChar.length}}`, 'g');
  const chunks = str.match(re);
  return chunks.pop() === defaults.ETXChar;
}
