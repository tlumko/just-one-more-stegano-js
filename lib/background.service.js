const sha256 = require('sha256');

module.exports = {
  init,
};

function init(buffer) {
  const data = buffer;
  const used = [];
  const limit = data.length;
  let x = 0;
  let skipAlpha = true;

  let a = 125;
  let b = 136;
  let c = 246;

  return {
    setup,
    takeNext,
    changeNext,
    changeCouple,
    all,
  };

  function setup(args) {
    skipAlpha = args.skipAlpha;

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

  function next() {
    let index = (a + b*x + c*x*x) % limit;
    let valid = validateIndex(index);;

    while (!valid) {
      index = (index+1) % limit;
      valid = validateIndex(index);
    }

    used.push(index);
    x++;

    return {
      val: buffer[index],
      index: index,
    };
  }

  function validateIndex(index) {
    if (skipAlpha && isAlpha(index)) {
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