var Kraken = require('./kraken');

module.exports = function() {
  var kraken = new Kraken();
  return kraken.run();
};
