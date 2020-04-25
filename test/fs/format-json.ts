import { formatJson } from '../../src/utils/fs';
import { Test, assert, test } from '../helper';

const tests1: Test[] = [
  test('fs.formatJson', () => {
    assert(formatJson({ foo: 123 }) === '{"foo":123}');
    assert(formatJson({ foo: 123 }, 2) === '{\n  "foo": 123\n}');
  })
];

export { tests1 as tests };
