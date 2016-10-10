import beater from 'beater';
import * as assert from 'power-assert';
import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';

import {
  listEntryIds as listEntryIdsType,
  parseEntry as parseEntryType
} from '../../src/parse/bbn';

const { test } = beater();

const category = 'parse > bbn > ';

test(category + 'listEntryIds', () => {
  const listEntryIdsStub = {};

  const listEntryIds: typeof listEntryIdsType = proxyquire(
    '../../src/parse/bbn',
    { './base': { listEntryIds: listEntryIdsStub } }
  ).listEntryIds;

  assert(listEntryIds === listEntryIdsStub);
});

test(category + 'parseEntry', () => {
  const meta = {
    minutes: 10,
    pubdate: '2006-01-02T15:04:05-07:00',
    title: 'title'
  };
  const data = 'markdown';

  const parseJson = sinon.stub();
  const path = sinon.stub();
  const readFile = sinon.stub();

  parseJson.onCall(0).returns(meta);
  path.onCall(0).returns('data/2006/01');
  path.onCall(1).returns('data/2006/01/2006-01-02.json');
  path.onCall(2).returns('data/2006/01/2006-01-02.md');
  readFile.onCall(0).returns(JSON.stringify(meta));
  readFile.onCall(1).returns(data);

  const parseEntry: typeof parseEntryType = proxyquire(
    '../../src/parse/bbn',
    { '../utils/fs': { parseJson, path, readFile } }
  ).parseEntry;

  const entryId = { year: '2006', month: '01', date: '02', title: undefined };
  assert.deepEqual(parseEntry('data', entryId), {
    id: entryId,
    minutes: 10,
    pubdate: '2006-01-02T15:04:05-07:00',
    tags: [],
    title: 'title',
    data,
    date: '2006-01-03', // in time zone +09:00
    html: '<p>markdown</p>\n'
  });
  assert(parseJson.callCount === 1);
  assert.deepEqual(parseJson.getCall(0).args, [JSON.stringify(meta)]);
  assert(path.callCount === 3);
  assert.deepEqual(path.getCall(0).args, ['data', '2006', '01']);
  assert.deepEqual(path.getCall(1).args, ['data/2006/01', '2006-01-02.json']);
  assert.deepEqual(path.getCall(2).args, ['data/2006/01', '2006-01-02.md']);
  assert(readFile.callCount === 2);
  assert.deepEqual(readFile.getCall(0).args, ['data/2006/01/2006-01-02.json']);
  assert.deepEqual(readFile.getCall(1).args, ['data/2006/01/2006-01-02.md']);
});
