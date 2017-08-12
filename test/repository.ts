import { Test, test } from 'beater';
import * as assert from 'power-assert';
import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';

import {
  Repository
} from '../src/repository';

const tests1: Test[] = [
  test('repository.Repository', () => {
    // TODO
    assert(Repository);
    assert(sinon);
    assert(proxyquire);
  })
];

export { tests1 as tests };

