const fs = require('fs')
const { PNG } = require('pngjs')

module.exports = {
  parseImage,
}

function parseImage(img) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(img)
      .pipe(new PNG({}))
      .on('parsed', function () { resolve(this) })
      .on('error', err => reject(err))
  })
}