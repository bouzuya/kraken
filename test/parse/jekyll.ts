import * as parseBaseModule from '../../src/parse/base';
import {
  listEntryIds,
  parseEntry as parseEntryType
} from '../../src/parse/jekyll';
import { Test, assert, sinon, test } from '../helper';

const category = 'parse > jekyll > ';

const tests1: Test[] = [
  test(category + 'listEntryIds', ({ sandbox }) => {
    const listEntryIdsStub = sandbox.stub(parseBaseModule, 'listEntryIds');
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
