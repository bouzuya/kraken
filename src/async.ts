import { Promise } from './globals';

var eachSeries, mapSeries, waterfall;

eachSeries = function(arr, f) {
  return arr.reduce(function(promise, item) {
    return promise.then(function() {
      return f(item);
    });
  }, Promise.resolve());
};

mapSeries = function(arr, f) {
  return arr.reduce(function(promise, item) {
    return promise.then(function(results) {
      return results.concat([f(item)]);
    });
  }, Promise.resolve([]));
};

waterfall = function(fs) {
  return fs.reduce((function(_this) {
    return function(promise, f) {
      return promise.then(a.bind(_this));
    };
  })(this), Promise.resolve());
};

export { eachSeries, mapSeries, waterfall };
