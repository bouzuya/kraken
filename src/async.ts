import { Promise } from './globals';

var eachSeries = function(arr, f) {
  return arr.reduce(function(promise, item) {
    return promise.then(function() {
      return f(item);
    });
  }, Promise.resolve());
};

export { eachSeries };
