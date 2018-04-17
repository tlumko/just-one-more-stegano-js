const fs = require('fs');

const keyService = require('./key.service.js');
const matrixService = require('./matrix.service.js');
const propsService = require('./properties.service.js');
const backgroundService = require('./background.service.js');
const utils = require('./utils.js');
const convertService = require('./convert.service.js');

module.exports = parse;

const { Console } = require('console');
const output = fs.createWriteStream('./parse.stdout.log');
const errorOutput = fs.createWriteStream('./parse.stderr.log');
const logger = new Console(output, errorOutput);

function parse(image, args) {
  console.log('args', args);
  Promise.all([
    resolveBackgroundAndProps(image, args),
    keyService.parse(args.key),
  ])
  .then(([[background, props], key]) => {
    const matrix = matrixService.create(key);
    logger.log('props', props);

    const output = {};
    output.dataLength = convertService.decodeLength(matrix, background);
    output.nameLength = convertService.decodeLength(matrix, background);

    let str = '';

    [['dataLength', 'data'], ['nameLength', 'name']].forEach(a => {
      while (str.length < output[a[0]]) {
        str += matrix[background.takeNext()][background.takeNext()];
      }
      output[a[1]] = str;
      str = '';
    });

    logger.log('output', output);
    logger.log('matrix', matrix);

    return convertService.transformOutput(output, props);
  })
  .then(output => {
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
