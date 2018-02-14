///todo: refactor
const fs = require('fs');

const keyService = require('./key.service.js');
const matrixService = require('./matrix.service.js');
const propsService = require('./properties.service.js');
const backgroundService = require('./background.service.js');
const utils = require('./utils.js');
const defaults = require('./defaults.js');

module.exports = {
  hide,
  parse,
};

function hide(image, text, args) {
  defaults.define(args);
  let generatedKey;
  if (args.generateKey) {
    generatedKey = keyService.generate(args);
    keyService.write(generatedKey);
    console.log('key is generated');
  }

  Promise.all([
    utils.parseImage(image),
    keyService.parse(args.key, generatedKey),
  ])
  .then(([png, key]) => {
    const background = backgroundService.init(png.data);
    propsService.encode(background, args);
    background.setup(args);

    if (args.unicode) {
      text = utils.strToNum(text, 16, 4);
    }

    const inputData = utils.fromStr(text, args) + defaults.EOTChar;
    const matrix = matrixService.create(key, args);

    transformBackground(background, inputData, matrix, args);

    if (args.noise) {
      harmUnused(background);
    }

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
    resolvePropsAndBackground(image, args),
    keyService.parse(args.key),
  ])
  .then(([[props, background], key]) => {
    defaults.define(props);
    const matrix = matrixService.create(key, props);

    let res = '';
    let parseCompleted = false;

    while (!parseCompleted) {
      res += matrix[background.takeNext()][background.takeNext()];
      if (endOfText(res)) {
        parseCompleted = true;
        res = res.slice(0, 0-defaults.EOTChar.length); //remove terminator char
      }
    }

    res = utils.toString(res, args);

    if (args.unicode) {
      res = utils.numToStr(res, 16, 4);
    }

    console.log(res);
    return res;
  })
  .catch(err => {
    console.log('oops', err)
  });
}

function endOfText(str) {
  const re = new RegExp(`.{1,${defaults.EOTChar.length}}`, 'g');
  const chunks = str.match(re);
  return chunks.pop() === defaults.EOTChar;
}

function resolvePropsAndBackground(image, args) {
  let background;

  return utils
    .parseImage(image)
    .then(png => {
      background = backgroundService.init(png.data);
    })
    .then(() => propsService.decode(background))
    .then(props => utils.resolvePassword(props))
    .then(props => {
      background.setup(Object.assign(args, props));
      return [props, background];
    });
}

function transformBackground(background, input, matrix, args) {
  input.split('').forEach(char => {
    background.changeCouple((first, second) => {
      return matrixService.findAround(matrix, char, {x: first, y: second});
    });
  });
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
