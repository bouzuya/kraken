import beater from 'beater';
import * as assert from 'power-assert';
import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';

import { writeFile as writeFileType } from '../../src/fs';

const { test } = beater();

test('fs.writeFile', () => {
  const outputFileSync = sinon.stub();
  const fs = proxyquire('../../src/fs', { 'fs-extra': { outputFileSync } });
  const writeFile: typeof writeFileType = fs.writeFile;
  assert(typeof writeFile('path', 'data') === 'undefined');
  assert(outputFileSync.callCount === 1);
  const args = outputFileSync.getCall(0).args;
  assert(args[0] === 'path');
  assert(args[1] === 'data');
  assert.deepEqual(args[2], { encoding: 'utf-8' });
});
