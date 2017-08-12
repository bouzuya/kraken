import { Test, test } from 'beater';
import * as assert from 'power-assert';

import { parseJson } from '../../src/utils/fs';

const tests1: Test[] = [
  test('fs.parseJson', () => {
    assert.deepEqual(parseJson('{"foo":123}'), { foo: 123 });
  })
];

export { tests1 as tests };
