const _ = require('lodash');

const settings = require('./settings.js');
const convertService = require('./convert.service.js');
const inputType = require('./constants.js').inputType;

const numeralSystems = [
  ['base2'],
  ['base4', 'base8', ],
  ['base16', 'base64', 'ascii', ],
];

const propsSet = ['useAlpha', 'password', 'ascii', 'unicode', ];

module.exports = {
  encode,
  decode,
};

function encode(background, args, input) {
  encodeNumeralSystem(background, settings.system);
  encodeProps(background, {
    useAlpha: args.useAlpha,
    password: !!args.password,
    ascii: input.type === inputType.ascii,
    unicode: input.type === inputType.unicode,
  });

  console.log({
    useAlpha: args.useAlpha,
    password: !!args.password,
    ascii: input.type === inputType.ascii,
    unicode: input.type === inputType.unicode,
    system: settings.system,
  })
}

function decode(background) {
  let system, props, index;
  system = parseNumeralSystem(background);
  defineSettings(system);
  props = parseProps(background);
  props.system = system;
  console.log(props);
  return props;
}

function defineSettings(system) {
  settings.define(system);
  convertService.define();
}

function encodeNumeralSystem(background, system) {
  numeralSystems.some((systemsPerBit) => {
    let finished = false;

    background.changeNext((bit) => {
      systemsPerBit.some((s, index) => {
        if (system !== s) {
          bit = clearBit(bit, index);
        } else {
          bit = setBit(bit, index);
          finished = true;
          return true;
        }
      });
      return bit;
    });

    return finished;
  });
}

function parseNumeralSystem(background) {
  let system;

  numeralSystems.some((systemsPerBit) => {
    const bit = background.takeNext();
    system = systemsPerBit.find((s, magnitude) => {
      return checkBit(bit, magnitude);
    });
    return system;
  });

  return system;
}

function encodeProps(background, args) {
  const propsChunks = splitProps();

  propsChunks.forEach((props, i) => {
    background.changeNext((bit) => {
      props.forEach((prop, ii) => {
        if (args[prop]) {
          bit = setBit(bit, ii);
        } else {
          bit = clearBit(bit, ii);
        }
      });

      return bit;
    });
  });
}

function parseProps(background) {
  const propsChunks = splitProps();
  const props = {};

  propsChunks.forEach((chunk, i) => {
    const bit = background.takeNext();

    chunk.forEach((prop, ii) => {
      props[prop] = checkBit(bit, ii);
    });
  });

  return props;
}

function splitProps() {
  const maxDistortion = settings.key.length - 1;
  return _.chunk(propsSet, Math.floor(Math.sqrt(maxDistortion + 1)));
}

function checkBit(num, bit){
  return ((num>>bit) % 2 != 0)
}

function setBit(num, bit){
  return num | 1<<bit;
}

function clearBit(num, bit){
  return num & ~(1<<bit);
}