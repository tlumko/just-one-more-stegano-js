const defaults = require('./defaults.js');

const numeralSystems = [
  ['base4', 'base8', ],
  ['base16', ],
];

const propsSet = ['skipAlpha',];

module.exports = {
  encode,
  decode,
};

function encode(buffer, args) {
  let index = encodeNumeralSystem(buffer, defaults.name);
  index = encodeProps(buffer, args, index+1);
  return index;
}

function decode(buffer) {
  let system, props, index;
  [system, index] = parseNumeralSystem(buffer);
  [props, index] = parseProps(buffer, index+1);
  props.system = system;
  return [props, index];
}

function encodeNumeralSystem(buffer, system) {
  return numeralSystems.findIndex((systemsPerBit, i) => {
    return systemsPerBit.some((s, ii) => {
      if (system !== s) {
        buffer[i] = clearBit(buffer[i], ii);
      } else {
        buffer[i] = setBit(buffer[i], ii);
        return true;
      }
    });
  });
}

function parseNumeralSystem(buffer) {
  let system;
  let index = numeralSystems.findIndex((systemsPerBit, index) => {
    system = systemsPerBit.find((s, magnitude) => {
      return checkBit(buffer[index], magnitude);
    });
    return system;
  });
  return [system, index];
}

function encodeProps(buffer, args, index) {
  propsSet.forEach((prop, i) => {
    if (args[prop]) {
      buffer[index+i] = setBit(buffer[index+i], 0);
    } else {
      buffer[index+i] = clearBit(buffer[index+i], 0);
    }
  });
  return index + propsSet.length;
}

function parseProps(buffer, index) {
  const props =  propsSet.reduce((accum, prop, i) => {
    accum[prop] = checkBit(buffer[index+i], 0);
    return accum;
  }, {});
  index = index + propsSet.length;
  return [props, index];
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