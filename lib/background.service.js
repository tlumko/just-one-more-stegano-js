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
  let index = 0;
  let pos = 0;
  var uu = [];

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
    let increment = hash[index%hash.length];
    pos += increment;

    if (pos >= order.length) {
      pos = pos%(order.length-index);
      pos += index;
    }

    [order[index], order[pos]] = [order[pos], order[index]]

    index++;

    if (!useAlpha && isAlpha(index)) {
      index++;
    }

[111, 100, 252, 255, 122, 113, 253, 255, 192, 189, 253, 255, 120, 112, 252, 255, 158, 152, 255, 255, 132, 123, 255, 255, 124, 114, 252, 255, 129, 120, 255, 255, 95, 83, 255, 255]

    // if (used.length >= limitForUse) { throw 'input is way too big'; }

    // let x = used.length;
    // let index = (a + b*x + c*x*x) % limit;
    // let valid = validateIndex(index);;

    // while (!valid) {
    //   index = (index+1) % limit;
    //   valid = validateIndex(index);
    // }

    // used.push(index);

    uu.push(order[index]);
    console.log(uu);
    console.log(uu.filter((e, i, arr) => arr.indexOf(e) === i))

    return {
      val: data[order[index]],
      index: order[index],
    };
  }

  function defineOrder() {

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

function shuffleByHash(arr, hash) {
  let pos = 0;
  for (let i = 0; i < arr.length-1; i++) {
    let increment = hash[i%hash.length];
    pos += increment;
    if (pos >= arr.length) {
    pos = pos%(arr.length-i);
      pos += i;
    }
    [arr[i], arr[pos]] = [arr[pos], arr[i]]
  }
  return arr;
}