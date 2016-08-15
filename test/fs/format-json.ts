import beater from 'beater';
import * as assert from 'power-assert';

import { formatJson } from '../../src/fs';

const { test } = beater();

test('fs.formatJson', () => {
  assert(formatJson({ foo: 123 }) === '{"foo":123}');
  assert(formatJson({ foo: 123 }, 2) === '{\n  "foo": 123\n}');
});
