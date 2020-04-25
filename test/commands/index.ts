import { tests as buildTests } from './build';
import { tests as migrateTests } from './migrate';
import { Test } from '../helper';

const tests1: Test[] = ([] as Test[])
  .concat(buildTests)
  .concat(migrateTests);

export { tests1 as tests };
