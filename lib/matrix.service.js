const keyService = require('./key.service.js');
const defaults = require('./defaults.js');

module.exports = {
  create,
  findAround,
};

function create(key) {
  key = key || defaults.key;
  const keyHeight = key.length;
  const keyWidth = key[0].length;
  const matrix = [];

  for (let i = 0; i < 256; i++) {
    if (!matrix[i]) { matrix[i] = [] }

    for (let j = 0; j < 256; j++) {
      matrix[i][j] = key[i%keyHeight][j%keyWidth];
    }
  }

  return matrix;
}

function findAround(matrix, goal, position) {
  let result;
  let availableList = [position];
  let usedList = [];

  result = availableList.find(({x, y}) => matrix[x][y] === goal);
  while (!result) {
    usedList = usedList.concat(availableList);
    availableList = findNeighbors(availableList, usedList);
    result = availableList.find(({x, y}) => matrix[x][y] === goal);
  }

  return [result.x, result.y];
}

function findNeighbors(list, usedList) {
  const neighbors = [];

  list.forEach(l => {
    const neighborsPosition = [
      {x: l.x+1, y: l.y},
      {x: l.x-1, y: l.y},
      {x: l.x, y: l.y+1},
      {x: l.x, y: l.y-1},
    ];

    neighborsPosition.forEach(m => {
      if (!usedList.find(k => k.x === m.x && k.y === m.y) &&
          !list.find(k => k.x === m.x && k.y === m.y) &&
          !neighbors.find(k => k.x === m.x && k.y === m.y) &&
          positionInBounds(m)) {
        neighbors.push(m);
      }
    });
  });

  return neighbors;
}

function positionInBounds(position) {
  return position.x >= 0 && position.x <=255 && position.y >= 0 && position.y <= 255
}