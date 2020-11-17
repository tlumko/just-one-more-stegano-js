const { createBackground } = require('./background')
const { createMatrix } = require('./matrix')
const { unicodeToHex } = require('./string-utils')
const { parseFile } = require('./utils')
const { sizeSectionLength } = require('./constants')

module.exports = {
  embed,
}

async function embed(image, file, textMode) {
  const background = await createBackground(image)
  const input = await prepareInput(file, textMode)
  const matrix = createMatrix()

  for (let i = 0; i < input.length; i++) {
    const char = input[i]
    const fragment = background.takeFragment()
    const charCoord = matrix.findAround({x: fragment[0].val, y: fragment[1].val}, char)
    background.replaceFragment(fragment, charCoord.x, charCoord.y)
  }

  await background.writeImage('joms.png')

  console.log('embeded')
}

async function prepareInput(filename, textMode) {
  let file
  if (textMode) {
    file = ''
  } else {
    file = await parseFile(filename)
  }

  const filestring = file.toString('hex')
  filename = unicodeToHex(filename)
  const filenameSizeSection = prepareInputSize(filename)
  const fileSizeSection = prepareInputSize(filestring)

  const input = [filenameSizeSection, fileSizeSection, filename, filestring].join('')

  return input
}

function prepareInputSize(input) {
  let inputSize = input.length.toString(16)
  inputSize = inputSize.padStart(sizeSectionLength, '0')
  return inputSize
}