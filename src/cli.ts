import * as fs from 'fs';
import * as commander from 'commander-b';
import kraken from './';

export class CLI {
  run() {
    var pkg;
    pkg = fs.readFileSync(__dirname + '/../package.json');
    return commander('kraken')
      .version(JSON.parse(pkg).version)
      .action(() => kraken())
      .execute();
  }
}
