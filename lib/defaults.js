const defaultsDict = {
  'base16': {
    name: 'base16',
    base: 16,
    codeLength: 2,
    key: [
      ['0', '1', '2', '3', ],
      ['4', '5', '6', '7', ],
      ['8', '9', 'a', 'b', ],
      ['c', 'd', 'e', 'f', ],
    ],
  },
  'base8': {
    name: 'base8',
    base: 8,
    codeLength: 3,
    key: [
      ['0', '1', '2', ],
      ['3', '4', '5', ],
      ['6', '7', '8', ],
    ],
  },
};

const defaults = {
  define,
};

module.exports = defaults

function define(args) {
  let system = args.system ? args.system : 'base16';

  if (!defaultsDict[system]) {
    throw `Unknown numeral system ${system}. Use one of these: ${Object.keys(defaultsDict)}`;
  }

  Object.assign(defaults, defaultsDict[system]);
}