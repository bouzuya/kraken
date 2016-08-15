import beater from 'beater';
import * as assert from 'power-assert';

import { parseJson } from '../../src/fs';

const { test } = beater();

test('fs.parseJson', () => {
  assert.deepEqual(parseJson('{"foo":123}'), { foo: 123 });
});
