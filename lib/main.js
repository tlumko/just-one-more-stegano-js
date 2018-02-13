const minimist = require('minimist');
const processDataService = require('./process-data.service.js');

parseInput();

function parseInput() {
  const args = minimist(process.argv.slice(2), {
    string: ['key', 'system', 'password', ],
    boolean: ['skipAlpha', 'modifyExisting', 'generateKey', 'help', ],
    alias: {
      'skip-alpha': 'skipAlpha',
      'do-not-touch-transparency': 'skipAlpha',
      'modify-existing-image': 'modifyExisting',
      'generate-key': 'generateKey',
      'p': 'password',
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
