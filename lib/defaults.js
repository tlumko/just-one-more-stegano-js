const defaultsDict = {
  'base16': {
    system: 'base16',
    base: 16,
    EOTChar: '03',
    codeLength: 2,
    key: [
      ['0', '1', '2', '3', ],
      ['4', '5', '6', '7', ],
      ['8', '9', 'a', 'b', ],
      ['c', 'd', 'e', 'f', ],
    ],
  },
  'base8': {
    system: 'base8',
    base: 8,
    EOTChar: '003',
    codeLength: 3,
    key: [
      ['0', '1', '2', ],
      ['3', '4', '5', ],
      ['6', '7', '8', ],
    ],
  },
  'base4': {
    system: 'base4',
    base: 4,
    EOTChar: '0003',
    codeLength: 4,
    key: [
      ['0', '1', ],
      ['2', '3', ],
    ],
  },
  'base64': {
    system: 'base64',
    base: 64,
    EOTChar: 'Aw==',
    key: [
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', '1', ],
      ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', '2', ],
      ['Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', '3', ],
      ['Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', '4', ],
      ['g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', '5', ],
      ['o', 'p', 'q', 'r', 's', 't', 'u', 'v', '6', ],
      ['w', 'x', 'y', 'z', '0', '1', '2', '3', '7', ],
      ['4', '5', '6', '7', '8', '9', '+', '/', '8', ],
      ['=', 'A', 'B', 'C', 'D', 'E', 'F', 'G', '9', ],
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