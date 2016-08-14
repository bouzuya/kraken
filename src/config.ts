import * as path from 'path';

var Config;

Config = (function() {
  function Config() {}

  Config.prototype.load = function() {
    this._rootDir = process.cwd();
    this._postsDir = path.join(this._rootDir, 'data');
    return this._dstDir = path.join(this._rootDir, 'dist');
  };

  Config.prototype.rootDir = function() {
    return this._rootDir;
  };

  Config.prototype.postsDir = function() {
    return this._postsDir;
  };

  Config.prototype.dstDir = function() {
    return this._dstDir;
  };

  return Config;

})();

export { Config };
