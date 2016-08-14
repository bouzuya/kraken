import * as fs from 'fs';
import * as commander from 'commander-b';
import { kraken } from './';

var CLI;

CLI = (function () {
  function CLI() {}

  CLI.prototype.run = function() {
    var pkg;
    pkg = fs.readFileSync(__dirname + '/../package.json');
    return commander('kraken').version(JSON.parse(pkg).version).action(function() {
      return kraken();
    }).execute();
  };

  return CLI;

})();

export { CLI };
