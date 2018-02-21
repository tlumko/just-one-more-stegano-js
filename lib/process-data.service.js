///todo: refactor
const fs = require('fs');
const _ = require('lodash');

const keyService = require('./key.service.js');
const matrixService = require('./matrix.service.js');
const propsService = require('./properties.service.js');
const backgroundService = require('./background.service.js');
const utils = require('./utils.js');
const defaults = require('./defaults.js');
const inputType = require('./constants.js').inputType;

module.exports = {
  embed,
  parse,
};

function embed(image, text, args) {
  defaults.define(args.system);
  let generatedKey;
  if (args.generateKey) {
    generatedKey = keyService.generate(args);
    keyService.write(generatedKey);
    console.log('key is generated');
  }

  Promise.all([
    utils.parseImage(image),
    utils.parseInput(text, args),
    keyService.parse(args.key, generatedKey),
  ])
  .then(([png, input, key]) => {
    const background = backgroundService.init(png.data);
    propsService.encode(background, args, input);
    background.setup(args);

    const inputData = utils.transformInput(input);
    const matrix = matrixService.create(key, args);

    transformBackground(background, inputData, matrix, args);

    let imgName = args.modifyExisting ? image : 'here-you-have.png';
    png.pack().pipe(fs.createWriteStream(imgName));
    console.log(`file ${imgName} is generated`);
    console.log('feel free to rename anything you want');
  })
  .catch(err => {
    console.log('oops', err)
  });
}

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

    output = utils.transformOutput(output, props);

    console.log(output.data);
    return output.data;
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

function transformBackground(background, input, matrix, args) {
  input.split('').forEach(char => {
    background.changeCouple((first, second) => {
      return matrixService.findAround(matrix, char, {x: first, y: second});
    });
  });

  if (args.noise) {
    harmUnused(background);
  }
}

function endOfText(str) {
  const re = new RegExp(`.{1,${defaults.ETXChar.length}}`, 'g');
  const chunks = str.match(re);
  return chunks.pop() === defaults.ETXChar;
}

function harmUnused(background) {
  const maxHarm = defaults.key.length - 1

  background.eachUnused((val, index, arr) => {
    let newVal = utils.random(val - maxHarm, val + maxHarm);

    if (newVal < 0) { newVal = 0; }

    if (newVal > 255) { newVal = 255; }

    arr[index] = newVal;
  });
}
