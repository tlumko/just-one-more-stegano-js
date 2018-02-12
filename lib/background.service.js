module.exports = {
  init,
};

function init(buffer) {
  const data = buffer;
  let index = -1;
  let skipAlpha = true;

  return {
    setup,
    takeNext,
    changeNext,
    changeCouple,
    all,
  };

  function setup(args) {
    skipAlpha = args.skipAlpha;
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
    index++;

    if (skipAlpha && isAlpha(index)) {
      index++;
    }

    return {
      val: buffer[index],
      index: index,
    };
  }
}

function isAlpha(index) {
  return !Boolean((index+1)%4);
}