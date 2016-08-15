import beater from 'beater';
import * as assert from 'power-assert';
import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';

import {
  Repository
} from '../src/repository';

const { test } = beater();

test('repository.Repository', () => {
  // TODO
  assert(Repository);
  assert(sinon);
  assert(proxyquire);
});
