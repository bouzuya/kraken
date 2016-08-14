import { Config } from './config';
import { Compiler } from './compiler';

var Kraken;

Kraken = (function() {
  function Kraken() {
    var dstDir, postsDir;
    this._config = new Config();
    this._config.load();
    postsDir = this._config.postsDir();
    dstDir = this._config.dstDir();
    this._compiler = new Compiler({
      postsDir: postsDir,
      dstDir: dstDir
    });
  }

  Kraken.prototype.run = function() {
    return this._compiler.compile();
  };

  return Kraken;

})();

export { Kraken };
