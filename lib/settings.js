const systems = require('./constants.js').systems;

const settings = {
  define,
};

module.exports = settings;

function define(system) {
  system = system || 'base16';

  if (!systems[system]) {
    throw `Unknown numeral system ${system}. Use one of these: ${Object.keys(systems)}`;
  }

  Object.assign(settings, systems[system]);
}