const { parse } = require('./parse')
const { embed } = require('./embed')

parseInput()

async function parseInput() {
  const [command, image, file, text] = process.argv.slice(2)

  if (!command || !image) {
    showHelp()
    return
  }

  if (command === 'embed') {
    if (!file) {
      showHelp()
      return
    }

    if (file === '-t' || file === '-text') {
      await embed(image, text, true)
      console.log('done')
      return
    }

    await embed(image, file)
    console.log('done')
    return
  }

  //3

  if (command === 'parse') {
    await parse(image)
    console.log('done')
    return
  }

  showHelp()
}

function showHelp() {
  console.log('usage: embed|parse <image.png> [--text] [<file>|<text payload>] ')
}

// ;(async () => {
//   await embed()
//   await parse()
// })()
