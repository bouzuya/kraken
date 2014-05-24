var Promise = require('q').Promise;

var eachSeries = function(arr, f) {
  return arr.reduce(function(promise, item) {
    return promise.then(function() { return f(item); });
  }, new Promise(function(resolve) { resolve(); }))
};

var mapSeries = function(arr, f) {
  var results = [];
  return arr.reduce(function(promise, item) {
    return promise.then(function() {
      return f(item);
    }).then(function(result) {
      results.push(result);
    });
  }, new Promise(function(resolve) { resolve(); }))
  .then(function() { return results; });
};

var waterfall = function(fs) {
  var context = this;
  return fs.reduce(function(promise, f) {
    return promise.then(function() {
      var args = Array.prototype.slice.call(arguments);
      return f.apply(context, args);
    });
  }, new Promise(function(resolve) { resolve(); }))
};

module.exports.eachSeries = eachSeries;
module.exports.mapSeries = mapSeries;
module.exports.waterfall = waterfall;
