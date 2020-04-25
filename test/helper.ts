import { Test, run } from 'beater';
import { named as namedFn } from 'beater-helpers';
import * as assert from 'power-assert';
import * as sinon from 'sinon';

function test(name: string, testFn: Function): Test {
  return namedFn(name, testFn);
}

export { Test, assert, run, sinon, test };
