import { Test, test } from 'beater';
import * as assert from 'power-assert';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';

import {
  listEntryIds as listEntryIdsType,
  parseEntry
} from '../../src/parse/base';

const category = 'parse > base > ';

const tests1: Test[] = [
  test(category + 'listEntryIds', () => {
    const listFiles = sinon.stub();
    listFiles.returns([
      '/home/bouzuya/data/2006-01-02.md',
      '/home/bouzuya/data/2006-01-03-title.md',
      '/home/bouzuya/data/2006-01-04.json'
    ]);

    const listEntryIds: typeof listEntryIdsType = proxyquire(
      '../../src/parse/base',
      { '../utils/fs': { listFiles } }
    ).listEntryIds;

    assert.deepEqual(listEntryIds('./data'), [
      { year: '2006', month: '01', date: '02', title: undefined },
      { year: '2006', month: '01', date: '03', title: 'title' }
    ]);
    assert(listFiles.callCount === 1);
    assert(listFiles.getCall(0).args[0] === './data');
  }),

  test(category + 'parseEntry', () => {
    const meta = {
      minutes: 10,
      pubdate: '2006-01-02T15:04:05-07:00',
      title: 'title'
    };
    const data = 'markdown';

    const parse = sinon.stub();
    parse.returns({ meta, data });

    const entryId = { year: '2006', month: '01', date: '02', title: undefined };
    assert.deepEqual(parseEntry('data', entryId, parse), {
      id: entryId,
      minutes: 10,
      pubdate: '2006-01-02T15:04:05-07:00',
      tags: [],
      title: 'title',
      data,
      date: '2006-01-03', // in time zone +09:00
      html: '<p>markdown</p>\n'
    });
    assert(parse.callCount === 1);
    assert.deepEqual(parse.getCall(0).args, ['data', entryId]);
  })
];

export { tests1 as tests };
