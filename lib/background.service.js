module.exports = {
  init,
};

function init(buffer, args, startOffset) {
  data = buffer;
  skipAlpha = args.skipAlpha;
  index = startOffset-1;

  return {
    changeCouple,
    takeNext,
    all,
  };

  function all() {
    return data;
  }

  function takeNext() {
    return next().val;
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