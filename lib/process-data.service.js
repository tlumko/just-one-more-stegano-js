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
    const inputData = utils.fromStr(text, args) + defaults.EOTChar;
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
    utils.parseImage(image),
    keyService.parse(args.key),
  ])
  .then(([png, key]) => {
    const background = backgroundService.init(png.data);
    props = propsService.decode(background);
    background.setup(props);
    defaults.define(props);
    const matrix = matrixService.create(key, props);

    let res = '';
    let parseCompleted = false;

    while (!parseCompleted) {
      res += matrix[background.takeNext()][background.takeNext()];
      if (res.slice(0-defaults.EOTChar.length) === defaults.EOTChar) {
        parseCompleted = true;
        res = res.slice(0, 0-defaults.EOTChar.length); //remove terminator char
      }
    }

    res = utils.toString(res, args);
    console.log(res);
    return res;
  })
  .catch(err => {
    console.log('oops', err)
  });
}

function transformBackground(background, input, matrix, args) {
  input.split('').forEach(char => {
    background.changeCouple((first, second) => {
      return matrixService.findAround(matrix, char, {x: first, y: second});
    });
  });
}
