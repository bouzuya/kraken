import beater from 'beater';
import * as assert from 'power-assert';
import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';

import { formatJson } from '../src/fs';
import {
  migrate as mimgrateType
} from '../src/migrate';

const { test } = beater();

test('migrate.migrate', () => {
  const id1 = { year: '2006', month: '01', date: '02', title: undefined };
  const meta1 = {
    minutes: 1,
    pubdate: '2006-01-02T15:04:05-07:00',
    tags: [],
    title: 'title'
  };
  const id2 = { year: '2006', month: '01', date: '03', title: 'title' };
  const meta2 = {
    minutes: 2,
    pubdate: '2006-01-03T15:04:05-07:00',
    tags: ['misc'],
    title: 'title2'
  };
  const listEntryIds = sinon.stub();
  const parseEntry = sinon.stub();
  const writeFile = sinon.stub();
  listEntryIds.returns([id1, id2]);
  parseEntry.onCall(0).returns(
    Object.assign({}, meta1, { data: '2006-01-02' }));
  parseEntry.onCall(1).returns(
    Object.assign({}, meta2, { data: '2006-01-03' }));

  const migrate: typeof mimgrateType = proxyquire(
    '../src/migrate',
    {
      './fs': { writeFile },
      './parse': { listEntryIds, parseEntry }
    }
  ).migrate;

  migrate('old-data', 'new-data');
  assert(listEntryIds.callCount === 1);
  assert(listEntryIds.getCall(0).args[0] === 'old-data');
  assert(parseEntry.callCount === 2);
  assert(parseEntry.getCall(0).args[0] === 'jekyll');
  assert(parseEntry.getCall(0).args[1] === 'old-data');
  assert.deepEqual(parseEntry.getCall(0).args[2], id1);
  assert(parseEntry.getCall(1).args[0] === 'jekyll');
  assert(parseEntry.getCall(1).args[1] === 'old-data');
  assert.deepEqual(parseEntry.getCall(1).args[2], id2);
  assert(writeFile.callCount === 4);
  assert(writeFile.getCall(0).args[0] === 'new-data/2006/01/2006-01-02.json');
  assert(writeFile.getCall(0).args[1] === formatJson(meta1, 2));
  assert(writeFile.getCall(1).args[0] === 'new-data/2006/01/2006-01-02.md');
  assert(writeFile.getCall(1).args[1] === '2006-01-02');
  assert(
    writeFile.getCall(2).args[0] === 'new-data/2006/01/2006-01-03-title.json');
  assert(writeFile.getCall(2).args[1] === formatJson(meta2, 2));
  assert(
    writeFile.getCall(3).args[0] === 'new-data/2006/01/2006-01-03-title.md');
  assert(writeFile.getCall(3).args[1] === '2006-01-03');
});
