const propsMap = {
  skipAlpha: 1    
};

module.exports = {
  encode,
  decode
}

function encode(args) {
  let mask = 0;
  Object.keys(propsMap).forEach(key => {
    mask = args[key] ? mask | propsMap[key] : mask;
  });
  return mask;
}

function decode(mask) {
  const props = {};
  Object.keys(propsMap).forEach(key => {
    props[key] = mask & propsMap.skipAlpha;    
  });
  return props;
} 