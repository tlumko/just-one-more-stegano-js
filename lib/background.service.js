const sha256 = require('sha256');

module.exports = {
  init,
};

function init(buffer) {
  const data = buffer;
  const order = [...buffer].map((v, i) => i);
  const used = [];
  const limit = data.length;
  let limitForUse = limit*3/4;
  let useAlpha = false;
  let index = -1;
  let pos = 0;

  let hash = sha256('deffault pass', {asBytes: true});

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
      hash = sha256(args.password, {asBytes: true});
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
    let [first, second] = [next(), next()];
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
    index++;

    if (useAlpha && isAlpha(index)) {
      index++;
    }

    let increment = hash[index%hash.length];
    pos += increment+1;

    if (pos >= order.length) {
      pos = pos%(order.length);
      pos += index;
    }

    if (useAlpha && isAlpha(index)) {
      index++;
    }

    if (pos >= order.length) {
      pos = pos%(order.length);
      pos += index;
    }

    const res = {
      val: data[order[pos]],
      index: order[pos]
    };

    [order[index], order[pos]] = [order[pos], order[index]];
    return res;
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
