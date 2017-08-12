import { Test, test } from 'beater';
import * as assert from 'power-assert';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';

import {
  listEntryIds as listEntryIdsType,
  parseEntry as parseEntryType
} from '../../src/parse/jekyll';

const category = 'parse > jekyll > ';

const tests1: Test[] = [
  test(category + 'listEntryIds', () => {
    const listEntryIdsStub = {};

    const listEntryIds: typeof listEntryIdsType = proxyquire(
      '../../src/parse/bbn',
      { './base': { listEntryIds: listEntryIdsStub } }
    ).listEntryIds;

    assert(listEntryIds === listEntryIdsStub);
  }),

  test(category + 'parseEntry', () => {
    // TODO
    assert(1 === 1);
    assert(sinon);
    assert(parseEntryType);
  })
];

export { tests1 as tests };
