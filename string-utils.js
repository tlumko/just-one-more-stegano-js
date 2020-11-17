module.exports = {
  unicodeToHex,
  hexToUnicode,
}

function unicodeToHex(str) {
  let res = ''

  for(let i = 0; i < str.length; i++) {
    let hex = str.charCodeAt(i).toString(16)
    res += ('000' + hex).slice(-4)
  }

  return res
}

function hexToUnicode(str) {
  let res = ''

  for (let i = 0; i < str.length; i += 4) {
    const hex = parseInt(str.substr(i, 4), 16)
    const symbol = String.fromCharCode(hex)
    res += symbol
  }

  return res
}
