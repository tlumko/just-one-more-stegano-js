const minimist = require('minimist');
const processDataService = require('./processData.service.js');

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

  if (command === 'parse') { processDataService.parse(image, args) }

  if (command === 'hide') {
    if (!text) throw 'provide some text';

    processDataService.hide(image, text, args);
  }
}
