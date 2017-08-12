import { Test, test } from 'beater';
import * as assert from 'power-assert';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';

import { writeFile as writeFileType } from '../../src/utils/fs';

const tests1: Test[] = [
  test('fs.writeFile', () => {
    const outputFileSync = sinon.stub();
    const fs = proxyquire('../../src/utils/fs', {
      'fs-extra': { outputFileSync }
    });
    const writeFile: typeof writeFileType = fs.writeFile;
    assert(typeof writeFile('path', 'data') === 'undefined');
    assert(outputFileSync.callCount === 1);
    const args = outputFileSync.getCall(0).args;
    assert(args[0] === 'path');
    assert(args[1] === 'data');
    assert.deepEqual(args[2], { encoding: 'utf-8' });
  })
];

export { tests1 as tests };
