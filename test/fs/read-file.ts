import beater from 'beater';
import * as assert from 'power-assert';
import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';

import { readFile as readFileType } from '../../src/fs';

const { test } = beater();

test('fs.readFile', () => {
  const readFileSync = sinon.stub();
  readFileSync.returns('content');
  const fs = proxyquire('../../src/fs', { fs: { readFileSync } });
  const readFile: typeof readFileType = fs.readFile;
  assert(readFile('path') === 'content');
  assert(readFileSync.callCount === 1);
  const args = readFileSync.getCall(0).args;
  assert(args[0] === 'path');
  assert.deepEqual(args[1], { encoding: 'utf-8' });
});
