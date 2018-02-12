const defaults = require('./defaults.js');

const numeralSystems = [
  ['base4', 'base8', ],
  ['base16', 'base64', ],
];

const propsSet = ['skipAlpha',];

module.exports = {
  encode,
  decode,
};

function encode(background, args) {
  encodeNumeralSystem(background, defaults.system);
  encodeProps(background, args);
}

function decode(background) {
  let system, props, index;
  system = parseNumeralSystem(background);
  props = parseProps(background);
  props.system = system;
  return props;
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
  propsSet.forEach((prop, i) => {
    background.changeNext((bit) => {
      if (args[prop]) {
        bit = setBit(bit, 0);
      } else {
        bit = clearBit(bit, 0);
      }
      return bit;
    });
  });
}

function parseProps(background) {
  return propsSet.reduce((accum, prop, i) => {
    accum[prop] = checkBit(background.takeNext(), 0);
    return accum;
  }, {});
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