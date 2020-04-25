import * as proxyquire from 'proxyquire';
import { readFile as readFileType } from '../../src/utils/fs';
import { Test, assert, sinon, test } from '../helper';

const tests1: Test[] = [
  test('fs.readFile', () => {
    const readFileSync = sinon.stub();
    readFileSync.returns('content');
    const fs = proxyquire('../../src/utils/fs', { fs: { readFileSync } });
    const readFile: typeof readFileType = fs.readFile;
    assert(readFile('path') === 'content');
    assert(readFileSync.callCount === 1);
    const args = readFileSync.getCall(0).args;
    assert(args[0] === 'path');
    assert.deepEqual(args[1], { encoding: 'utf-8' });
  })
];

export { tests1 as tests };
