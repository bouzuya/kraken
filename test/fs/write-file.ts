import { writeFile } from '../../src/utils/fs';
import { Test, assert, test } from '../helper';
import * as fsExtraModule from 'fs-extra';

const tests1: Test[] = [
  test('fs.writeFile', ({ sandbox }) => {
    const outputFileSync = sandbox.stub(fsExtraModule, 'outputFileSync');
    assert(typeof writeFile('path', 'data') === 'undefined');
    assert(outputFileSync.callCount === 1);
    const args = outputFileSync.getCall(0).args;
    assert(args[0] === 'path');
    assert(args[1] === 'data');
    assert.deepEqual(args[2], { encoding: 'utf-8' });
  })
];

export { tests1 as tests };
