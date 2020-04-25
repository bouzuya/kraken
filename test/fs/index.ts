import { tests as formatJsonTests } from './format-json';
import { tests as listFilesTests } from './list-files';
import { tests as parseJsonTests } from './parse-json';
import { tests as pathTests } from './path';
import { tests as readFileTests } from './read-file';
import { tests as writeFileTests } from './write-file';
import { Test } from '../helper';

const tests1: Test[] = ([] as Test[])
  .concat(formatJsonTests)
  .concat(listFilesTests)
  .concat(parseJsonTests)
  .concat(pathTests)
  .concat(readFileTests)
  .concat(writeFileTests);

export { tests1 as tests };
