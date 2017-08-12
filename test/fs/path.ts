import { Test, test } from 'beater';
import * as assert from 'power-assert';
import { join } from 'path';

import { path } from '../../src/utils/fs';

const tests1: Test[] = [
  test('fs.path', () => {
    assert(path === join);
  })
];

export { tests1 as tests };
