const minimist = require('minimist');

const processDataService = require('./process-data.service.js');
const utils = require('./utils.js');

parseInput();

function parseInput() {
  const args = minimist(process.argv.slice(2), {
    string: ['key', 'system', ],
    boolean: ['useAlpha', 'modifyExisting', 'generateKey', 'help', 'password', 'unicode', 'noise', ],
    alias: {
      'use-alpha': 'useAlpha',
      'a': 'useAlpha',
      'modify-existing-image': 'modifyExisting',
      'generate-key': 'generateKey',
      'p': 'password',
      'u': 'unicode',
      'n': 'noise',
      'harm-all-pixels': 'noise',
    },
  });

  const [command, image, text] = args._;

  utils
    .resolvePassword(args)
    .then(args => {
      try {
        if (command !== 'embed' && command !== 'parse') { throw 'dude, either parse or embed' }
        if (!image) { throw 'you\'d better provide some' }
        if (image.slice(-4) !== '.png') { throw 'only \'.png\', sry' }

        if (command === 'parse') { processDataService.parse(image, args) }

        if (command === 'embed') {
          if (!text) throw 'provide some text';

          processDataService.embed(image, text, args);
        }
      } catch (e) {
        console.log(e);
      }
    });
}

