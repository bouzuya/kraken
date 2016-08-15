import * as fs from 'fs';
import * as commander from 'commander-b';
import kraken from './';
import { Promise } from './globals';

export class CLI {
  run(): Promise<void> {
    const pkg = fs.readFileSync(__dirname + '/../package.json');
    return commander('kraken')
      .version(JSON.parse(pkg).version)
      .action(() => kraken())
      .execute();
  }
}
