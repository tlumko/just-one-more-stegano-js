const { createBackground } = require('./background')
const { createMatrix } = require('./matrix')
const { hexToUnicode } = require('./string-utils')
const { writeFile } = require('./utils')
const { sizeSectionLength } = require('./constants')

module.exports = {
  parse,
}

async function parse(image) {
  const matrix = createMatrix()
  const background = await createBackground(image)

  let position = 0
  let border = parseInt(sizeSectionLength)
  const filenameSizeSection = parseChunk(position, border, background, matrix)

  position = border
  border += parseInt(sizeSectionLength)
  const fileSizeSection = parseChunk(position, border, background, matrix)

  position = border
  border += parseInt(filenameSizeSection, 16)
  let filename = parseChunk(position, border, background, matrix)
  filename = hexToUnicode(filename)

  position = border
  border += parseInt(fileSizeSection, 16)
  let file = parseChunk(position, border, background, matrix)

  if (file) {
    await writeFile(filename, file)
    console.log('end')
  } else {
    console.log(filename)
  }
}

function parseChunk(from, to, background, matrix) {
  let res = ''

  for (i = from; i < to; i++) {
    const fragment = background.takeFragment()
    const char = matrix.get(fragment[0].val, fragment[1].val)
    res += char
  }

  return res
}