import beater from 'beater';
import * as assert from 'power-assert';
import { join } from 'path';

import { path } from '../../src/fs';

const { test } = beater();

test('fs.path', () => {
  assert(path === join);
});
