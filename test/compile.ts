import beater from 'beater';
import * as assert from 'power-assert';

import { compile, compileNew, compileOld } from '../src/compile';

const { test } = beater();

test('compile.compile', () => {
  // TODO
  assert(compile);
});

test('compile.compileNew', () => {
  assert(compileNew === compile);
});

test('compile.compileOld', () => {
  // TODO
  assert(compileOld);
});
