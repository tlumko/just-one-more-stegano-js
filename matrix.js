module.exports = {
  createMatrix,
}

function createMatrix() {
  const matrix = deployFromDraft()

  return {
    _data: matrix,
    findAround,
    get,
  }

  function get(x, y) {
    return matrix[x][y]
  }

  function findAround(coord, goal) {
    const used = []
    let candidates = [coord]

    let res = candidates.find(({x, y}) => matrix[x][y] === goal)

    while (!res) {
      candidates = getNeighbors(candidates, used)
      res = candidates.find(({x, y}) => matrix[x][y] === goal)
    }

    return res
  }
}

function getNeighbors(candidates, used) {
  const neighbors = []
  // const offsets = [[-1, 0], [1, 0], [0, 1], [0, -1]]
  const offsets = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]

  candidates.forEach(coord => {
    offsets.forEach(offset => {
      const neighbor = {
        x: coord.x + offset[0],
        y: coord.y + offset[1],
      }

      if (neighbor.x < 0 || neighbor.y < 0 || neighbor.x > 255 || neighbor.y >255) {
        return
      }

      if (listContainsCoord(used, neighbor) || listContainsCoord(candidates, neighbor) || listContainsCoord(neighbors, neighbor)) {
        return
      }

      neighbors.push(neighbor)
    })
  })

  return neighbors
}

function listContainsCoord(list, coord) {
  return list.some(c => c.x === coord.x && c.y === coord.y)
}

function deployFromDraft() {
  const draft = [
    ['0', '1', '2', '3'],
    ['4', '5', '6', '7'],
    ['8', '9', 'a', 'b'],
    ['c', 'd', 'e', 'f'],
  ]
  const matrixSize = 256
  const matrix = []

  draft.forEach(draftRow => {
    const matrixRow = []

    let i = 0
    while (i < matrixSize) {
      const position = i%draftRow.length
      matrixRow.push(draftRow[position])
      i++
    }

    matrix.push(matrixRow)
  })

  let i = matrix.length
  while (i < matrixSize) {
    const position = i%draft.length
    const newRow = matrix[position]
    matrix.push(newRow)
    i++
  }

  return matrix
}