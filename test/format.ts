import {
  formatAtom,
  formatDailyJson,
  formatMonthlyJson,
  formatYearlyJson,
  formatSitemap
} from '../src/format';
import { Entry } from '../src/types';
import { Test, assert, test } from './helper';

const tests1: Test[] = [
  test('format.formatAtom', () => {
    // TODO
    assert(formatAtom);
  }),

  test('format.formatDailyJson', () => {
    const entry: Entry = {
      id: { year: '2006', month: '01', date: '03', title: undefined },
      data: 'hello',
      date: '2006-01-03', // 2006-01-02T15:04:05-07:00 in +09:00
      html: '<p>hello</p>\n',
      minutes: 15,
      pubdate: '2006-01-02T15:04:05-07:00',
      tags: ['misc'],
      title: 'title'
    };
    const json = Object.assign({}, entry);
    delete json.id;
    assert.deepEqual(JSON.parse(formatDailyJson(entry)), json);
  }),

  test('format.formatMonthlyJson', () => {
    const entry1: Entry = {
      id: { year: '2006', month: '01', date: '03', title: undefined },
      data: 'hello',
      date: '2006-01-03', // 2006-01-02T15:04:05-07:00 in +09:00
      html: '<p>hello</p>\n',
      minutes: 15,
      pubdate: '2006-01-02T15:04:05-07:00',
      tags: ['misc'],
      title: 'title'
    };
    const json1 = Object.assign({}, entry1);
    delete json1.id;
    const entry2: Entry = {
      id: { year: '2006', month: '01', date: '03', title: undefined },
      data: 'hello2',
      date: '2006-01-03', // 2006-01-02T15:04:05-07:00 in +09:00
      html: '<p>hello2</p>\n',
      minutes: 16,
      pubdate: '2006-01-02T15:04:06-07:00',
      tags: ['programming'],
      title: 'title2'
    };
    const json2 = Object.assign({}, entry2);
    delete json2.id;
    assert.deepEqual(JSON.parse(formatMonthlyJson([entry1, entry2])), [json1, json2]);
  }),

  test('format.formatYearlyJson', () => {
    const entry1: Entry = {
      id: { year: '2006', month: '01', date: '03', title: undefined },
      data: 'hello',
      date: '2006-01-03', // 2006-01-02T15:04:05-07:00 in +09:00
      html: '<p>hello</p>\n',
      minutes: 15,
      pubdate: '2006-01-02T15:04:05-07:00',
      tags: ['misc'],
      title: 'title'
    };
    const json1 = Object.assign({}, entry1);
    delete json1.id;
    const entry2: Entry = {
      id: { year: '2006', month: '01', date: '03', title: undefined },
      data: 'hello2',
      date: '2006-01-03', // 2006-01-02T15:04:05-07:00 in +09:00
      html: '<p>hello2</p>\n',
      minutes: 16,
      pubdate: '2006-01-02T15:04:06-07:00',
      tags: ['programming'],
      title: 'title2'
    };
    const json2 = Object.assign({}, entry2);
    delete json2.id;
    assert.deepEqual(JSON.parse(formatYearlyJson([entry1, entry2])), [json1, json2]);
  }),

  test('format.formatSitemap', () => {
    // TODO
    assert(formatSitemap);
  })
];

export { tests1 as tests };

