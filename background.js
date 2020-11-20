const fs = require('fs')
const crypto = require('crypto')
const { parseImage } = require('./utils')

module.exports = {
  createBackground,
}

async function createBackground(img, secret='nosecret') {
  const png = await parseImage(img)
  const buffer = png.data
  const order = (new Array(buffer.length)).fill(0).map((_, index) => index)
  const hash = crypto.createHash('sha1').update(secret).digest()
  let pos = 0
  let index = -1

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
    index++

    if (isAlpha(index)) {
      index++
    }

    const increment = hash[index%(hash.length)] * 100
    pos += increment+1

    if (pos >= order.length - 1) { //the last entry in buffer - alpha. skip it
      pos = pos%(order.length)
      const spaceLeft = order.length - index - 1 //last alpha
      pos = pos%spaceLeft
      pos += index
    }

    if (isAlpha(pos)) {
      pos++
    }

    const res = {
      pos: order[pos],
      val: buffer[order[pos]]
    }

    ;[order[index], order[pos]] = [order[pos], order[index]]

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