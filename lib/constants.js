const inputType = {
  hex: 'hex',
  ascii: 'ascii',
  unicode: 'unicode',
};

const systems = {
  'base16': {
    system: 'base16',
    base: 16,
    byteLength: 2,
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
    byteLength: 3,
    key: [
      ['0', '1', '2', ],
      ['3', '4', '5', ],
      ['6', '7', '0', ],
    ],
  },
  'base4': {
    system: 'base4',
    base: 4,
    byteLength: 4,
    key: [
      ['0', '1', ],
      ['2', '3', ],
    ],
  },
  'base2': {
    system: 'base2',
    base: 2,
    byteLength: 8,
    key: [
      ['0', '1', ],
      ['1', '0', ],
    ],
  },
  'base64': {
    system: 'base64',
    base: 64,
    ETX: 'Aw==',
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

module.exports = {
  inputType,
  systems,
};