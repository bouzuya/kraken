var Config = require('./config');
var Compiler = require('./compiler');

var Kraken = function() {
  this._config = new Config();
  this._config.load();
  var srcDir = this._config.srcDir();
  var postsDir = this._config.postsDir();
  var dstDir = this._config.dstDir();
  this._compiler = new Compiler({ srcDir: srcDir, postsDir: postsDir, dstDir: dstDir });
};

Kraken.prototype.run = function() {
  return this._compiler.compile();
};

module.exports = Kraken;
