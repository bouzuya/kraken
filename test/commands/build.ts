import { Test, test } from 'beater';
import * as assert from 'power-assert';

import { compile, compileNew, compileOld } from '../../src/commands/build';

const tests1: Test[] = [
  test('compile.compile', () => {
    // TODO
    assert(compile);
  }),

  test('compile.compileNew', () => {
    assert(compileNew === compile);
  }),

  test('compile.compileOld', () => {
    // TODO
    assert(compileOld);
  })
];

export { tests1 as tests };
