import * as fs from 'fs';
import * as path from 'path';
import * as commander from 'commander-b';
import { migrate, compile, start } from './';

const run = (): void => {
  const packageJsonFile = path.join(__dirname, '..', 'package.json');
  const json = fs.readFileSync(packageJsonFile, { encoding: 'utf-8' });
  const pkg = JSON.parse(json);
  const command = commander('bbn-api').version(pkg.version);
  command
    .command('migrate <inDir> <outDir>', 'v3 data/ -> v4 data/')
    .action((inDir: string, outDir: string): void => {
      console.log('DEPRECATED:');
      migrate(inDir, outDir);
    });
  command
    .command('compile <inDir> <outDir>', 'v4 data/ -> dist/')
    .action((inDir: string, outDir: string): Promise<void> => {
      console.log('DEPRECATED: Use `kraken build`.');
      return compile(inDir, outDir);
    });
  command
    .command('build <inDir> <outDir>', 'v4 data/ -> dist/')
    .action((inDir: string, outDir: string): Promise<void> => {
      return compile(inDir, outDir);
    });
  command
    .command('start <dir>', 'run server')
    .action((dir: string): Promise<void> => {
      return start(dir);
    });
  command.execute();
};

export { run };
