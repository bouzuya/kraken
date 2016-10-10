import beater from 'beater';
import * as assert from 'power-assert';
import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';

import {
  listEntryIds as listEntryIdsType,
  parseEntry as parseEntryType
} from '../../src/parse/jekyll';

const { test } = beater();

const category = 'parse > jekyll > ';

test(category + 'listEntryIds', () => {
  const listEntryIdsStub = {};

  const listEntryIds: typeof listEntryIdsType = proxyquire(
    '../../src/parse/bbn',
    { './base': { listEntryIds: listEntryIdsStub } }
  ).listEntryIds;

  assert(listEntryIds === listEntryIdsStub);
});

test(category + 'parseEntry', () => {
  // TODO
  assert(1 === 1);
  assert(sinon);
  assert(parseEntryType);
});
