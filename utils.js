const fs = require('fs')
const { PNG } = require('pngjs')

module.exports = {
  parseImage,
  parseFile,
  writeFile,
}

function parseImage(img) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(img)
      .pipe(new PNG({}))
      .on('parsed', function () { resolve(this) })
      .on('error', err => reject(err))
  })
}

function parseFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) {
        return reject(err)
      }

      return resolve(data)
    })
  })
}

function writeFile(name, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(name, Buffer.from(data, 'hex'), err => {
      if(err) {
        return reject(err)
      }

      return resolve()
    })
  })
}