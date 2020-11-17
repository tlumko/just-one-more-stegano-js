const { createBackground } = require('./background')
const { createMatrix } = require('./matrix')
const { unicodeToHex, hexToUnicode } = require('./string-utils')

;(async () => {
  await embed()
  await parse()
})()


async function embed() {
  const input = unicodeToHex('asdf')
  const background = await createBackground('./example.png')
  const matrix = createMatrix()

  for (let i = 0; i < input.length; i++) {
    const char = input[i]
    const fragment = background.takeFragment()
    const charCoord = matrix.findAround({x: fragment[0].val, y: fragment[1].val}, char)
    background.replaceFragment(fragment, charCoord.x, charCoord.y)
  }

  await background.writeImage('111.png')

  console.log('embeded')
}

async function parse() {
  const matrix = createMatrix()
  const background = await createBackground('./111.png')

  let res = ''
  for (let i = 0; i < 16; i++) {
    const fragment = background.takeFragment()
    const char = matrix.get(fragment[0].val, fragment[1].val)
    res += char
  }

  const output = hexToUnicode(res)
  console.log(output)
}