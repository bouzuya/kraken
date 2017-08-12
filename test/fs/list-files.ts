import { Test, test } from 'beater';
import * as assert from 'power-assert';

import { listFiles } from '../../src/utils/fs';

const tests1: Test[] = [
  test('fs.listFiles', () => {
    // TODO
    assert(listFiles);
  })
];

export { tests1 as tests };
