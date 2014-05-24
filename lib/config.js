var Path = require('path');

var Config = function() {};

Config.prototype.load = function() {
  this._rootDir = process.cwd();
  this._srcDir = Path.join(this._rootDir, 'src');
  this._postsDir = Path.join(this._srcDir, '_posts');
  this._dstDir = Path.join(this._rootDir, 'build');
};

Config.prototype.rootDir = function() { return this._rootDir; };
Config.prototype.srcDir = function() { return this._srcDir; };
Config.prototype.postsDir = function() { return this._postsDir; };
Config.prototype.dstDir = function() { return this._dstDir; };

module.exports = Config;
