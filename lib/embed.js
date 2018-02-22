const fs = require('fs');

const keyService = require('./key.service.js');
const matrixService = require('./matrix.service.js');
const propsService = require('./properties.service.js');
const backgroundService = require('./background.service.js');
const utils = require('./utils.js');
const defaults = require('./defaults.js');
const convertService = require('./convert.service.js');

module.exports = embed;

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

    const inputData = convertService.transformInput(input);
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

function harmUnused(background) {
  const maxHarm = defaults.key.length - 1

  background.eachUnused((val, index, arr) => {
    let newVal = utils.random(val - maxHarm, val + maxHarm);

    if (newVal < 0) { newVal = 0; }

    if (newVal > 255) { newVal = 255; }

    arr[index] = newVal;
  });
}
