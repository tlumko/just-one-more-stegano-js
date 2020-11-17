const fs = require('fs')
const { parseImage } = require('./utils')

module.exports = {
  createBackground,
}

async function createBackground(img) {
  const png = await parseImage(img)
  const buffer = png.data
  let pos = 0

  return {
    _buffer: buffer,
    takeFragment,
    replaceFragment,
    writeImage,
  }

  function takeFragment() {
    return [next(), next()]
  }

  function replaceFragment(fragment, val1, val2) {
    buffer[fragment[0].pos] = val1
    buffer[fragment[1].pos] = val2
  }

  function next() {
    const res = {
      pos: pos,
      val: buffer[pos]
    }

    pos++

    if (isAlpha(pos)) {
      pos++
    }

    return res
  }

  function isAlpha(index) {
    return !((index+1)%4);
  }

  function writeImage(filename) {
    return new Promise((resolve, reject) => {
      png.pack()
        .pipe(fs.createWriteStream(filename))
        .on('error', (err) => reject(err))
        .on('close', function () { resolve(this) })
    })
  }
}