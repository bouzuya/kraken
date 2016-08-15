import * as fs from 'fs';
import * as path from 'path';
import * as commander from 'commander-b';
import { migrate, compile } from './';

const run = (): void => {
  const packageJsonFile = path.join(__dirname, '..', 'package.json');
  const json = fs.readFileSync(packageJsonFile, { encoding: 'utf-8' });
  const pkg = JSON.parse(json);
  const command = commander('bbn-api').version(pkg.version);
  command
    .command('migrate <inDir> <outDir>', 'v3 data/ -> v4 data/')
    .action((inDir: string, outDir: string): void => {
      migrate(inDir, outDir);
    });
  command
    .command('compile <inDir> <outDir>', 'v4 data/ -> dist/')
    .action((inDir: string, outDir: string): void => {
      compile(inDir, outDir);
    });
  command.execute();
};

export { run };
