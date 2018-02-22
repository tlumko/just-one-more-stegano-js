const systems = require('./constants.js').systems;

const defaults = {
  define,
};

module.exports = defaults;

function define(system) {
  system = system || 'base16';

  if (!systems[system]) {
    throw `Unknown numeral system ${system}. Use one of these: ${Object.keys(systems)}`;
  }

  Object.assign(defaults, systems[system]);
}