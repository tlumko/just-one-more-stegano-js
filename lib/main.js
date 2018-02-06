const fs = require('fs');
const PNG = require('pngjs').PNG;
const minimist = require('minimist');

const keyService = require('./key.service.js');
const matrixService = require('./matrix.service.js');
const propsService = require('./properties.service.js');
const backgroundService = require('./background.service.js');
const utils = require('./utils.js');
const defaults = require('./defaults.js');

const terminatorChar = '03';

parseInput();

function parseInput() {
  const args = minimist(process.argv.slice(2), {
    string: ['key', 'system',],
    boolean: ['skipAlpha', 'modifyExisting', 'generateKey', 'help', ],
    alias: {
      'skip-alpha': 'skipAlpha',
      'dont-touch-my-alpha-channel': 'skipAlpha',
      'modify-existing-image': 'modifyExisting',
      'generate-key': 'generateKey',
    },
  });

  const [command, image, text] = args._;

  if (command !== 'hide' && command !== 'parse') { throw 'dude, either parse or hide' }
  if (!image) { throw 'you\'d better provide some' }
  if (image.slice(-4) !== '.png') { throw 'only \'.png\', sry' }

  if (command === 'parse') { showData(image, args) }

  if (command === 'hide') {
    if (!text) throw 'provide some text';

    defaults.define(args);
    hideData(image, text, args);
  }
}

function hideData(image, text, args) {
  let generatedKey;
  if (args.generateKey) {
    generatedKey = keyService.generate(args);
    fs.writeFile('key', keyService.compact(generatedKey));
    console.log('key is generated');
  }

  Promise.all([
    utils.parseImage(image),
    utils.parseKey(args.key, generatedKey),
  ])
  .then(([png, key]) => {
    const offset = propsService.encode(png.data, args);
    const inputData = utils.fromStr(text, args) + terminatorChar;
    const matrix = matrixService.create(key, args);
    const background = backgroundService.init(png.data, args, offset);

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

function showData(image, args) {
  Promise.all([
    utils.parseImage(image),
    utils.parseKey(args.key),
  ])
  .then(([png, key]) => {
    [props, offset] = propsService.decode(png.data);
    defaults.define(props);
    const matrix = matrixService.create(key, props);
    const background = backgroundService.init(png.data, props, offset);

    let res = '';
    let parseCompleted = false;

    while (!parseCompleted && index < png.data.length) {
      res += matrix[background.takeNext()][background.takeNext()];
      if (res.slice(-2) === terminatorChar) {
        parseCompleted = true;
        res = res.slice(0, -2); //remove terminator char
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
