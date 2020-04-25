import * as proxyquire from 'proxyquire';
import {
  listEntryIds as listEntryIdsType,
  parseEntry as parseEntryType
} from '../../src/parse/jekyll';
import { Test, assert, sinon, test } from '../helper';

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
