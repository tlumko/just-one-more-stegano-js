const sha256 = require('sha256');

module.exports = {
  init,
};

function init(buffer) {
  const data = buffer;
  const used = [];
  const limit = data.length;
  let limitForUse = limit*3/4;
  let useAlpha = false;

  let a = 125;
  let b = 136;
  let c = 246;

  return {
    setup,
    takeNext,
    changeNext,
    changeCouple,
    eachUnused,
    all,
  };

  function setup(args) {
    useAlpha = args.useAlpha;

    if (useAlpha) {
      limitForUse = limitForUse*4/3;
    }

    if (args.password) {
      [a, b, c] = sha256(args.password, {asBytes: true});
    }
  }

  function all() {
    return data;
  }

  function takeNext() {
    return next().val;
  }

  function changeNext(cb) {
    const first = next();
    first.val = cb(first.val);
    data[first.index] = first.val;
  }

  function changeCouple(cb) {
    [first, second] = [next(), next()];
    [first.val, second.val] = cb(first.val, second.val);
    data[first.index] = first.val;
    data[second.index] = second.val;
  }

  function eachUnused(cb) {
    data.forEach((val, index, arr) => {
      if (used.includes(index)) { return; }

      cb(val, index, arr);
    });
  }

  function next() {
    if (used.length >= limitForUse) { throw 'input is way too big'; }

    let x = used.length;
    let index = (a + b*x + c*x*x) % limit;
    let valid = validateIndex(index);;

    while (!valid) {
      index = (index+1) % limit;
      valid = validateIndex(index);
    }

    used.push(index);

    return {
      val: buffer[index],
      index: index,
    };
  }

  function validateIndex(index) {
    if (!useAlpha && isAlpha(index)) {
      return false;
    }

    if (used.includes(index)) {
      return false;
    }

    return true
  }
}

function isAlpha(index) {
  return !Boolean((index+1)%4);
}