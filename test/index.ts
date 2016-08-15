import beater from 'beater';
import * as assert from 'power-assert';
import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';

const { test } = beater();

test('add', () => {
  assert(1 + 2 === 3);
  assert(sinon);
  assert(proxyquire);
});
