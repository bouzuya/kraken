import { Test, run } from 'beater';

import { tests as commandsTests } from './commands';
import { tests as fsTests } from './fs';
import { tests as formatTests } from './format';
import { tests as parseTests } from './parse';
import { tests as repositoryTests } from './repository';

const tests1: Test[] = ([] as Test[])
  .concat(commandsTests)
  .concat(fsTests)
  .concat(formatTests)
  .concat(parseTests)
  .concat(repositoryTests);

run(tests1).catch((_) => void process.exit(-1));
