const sha256 = require('sha256');

module.exports = {
  init,
};

function init(buffer, password) {
  const data = buffer;
  const order = [...buffer].map((v, i) => i);
  const limit = data.length;
  let limitForUse = limit*3/4;
  let useAlpha = false;
  let index = -1;
  let pos = 0;

  let hash = sha256(password || 'deffault pass', {asBytes: true});

  return {
    setup,
    takeNext,
    changeNext,
    changeCouple,
    eachUnused,
    all,
  };

  function setup(props) {
    useAlpha = props.useAlpha;

    if (useAlpha) {
      limitForUse = limitForUse*4/3;
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
    for (let i = index; i < limitForUse; i++) {
      if (!useAlpha && isAlpha(i)) {
        i++;
      }

      cb(data[order[i]], order[i], data);
    }
  }

  function next() {
    index++;

    if (!useAlpha && isAlpha(index)) {
      index++;
    }

    let increment = hash[index%hash.length];
    pos += increment+1;

    if (!useAlpha && isAlpha(pos)) {
      pos++;
    }

    if (pos >= order.length) {
      pos = pos%(order.length);
      pos += index;
    }

    if (!useAlpha && isAlpha(pos)) {
      pos++;
    }

    const res = {
      val: data[order[pos]],
      index: order[pos]
    };

    [order[index], order[pos]] = [order[pos], order[index]];
    return res;
  }
}

function isAlpha(index) {
  return !Boolean((index+1)%4);
}
