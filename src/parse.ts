import { parse } from 'jekyll-markdown-parser';
import { Entry, EntryId, RawEntry } from './types';
import { listFiles, parseJson, path, readFile } from './fs';
import { parseISOString } from 'time-keeper';
import * as marked from 'marked';

export type ParserType = 'jekyll' | 'default';

const loadJekyllMarkdown = (entryDir: string, entryId: EntryId): RawEntry => {
  const { year, month, date, title } = entryId;
  const dir = path(entryDir, year, month);
  const file = path(dir, `${year}-${month}-${date}-${title}.md`);
  const jekyllMarkdown = readFile(file);
  const { markdown: data, parsedYaml: meta } = parse(jekyllMarkdown);
  return { meta, data };
};

const loadBbnMarkdown = (entryDir: string, entryId: EntryId): RawEntry => {
  const { year, month, date, title } = entryId;
  const dir = path(entryDir, year, month);
  const baseName = typeof title === 'undefined'
    ? `${year}-${month}-${date}`
    : `${year}-${month}-${date}-${title}`;
  const jsonFile = path(dir, `${baseName}.json`);
  const markdownFile = path(dir, `${baseName}.md`);
  const metaJson = readFile(jsonFile);
  const markdown = readFile(markdownFile);
  const meta = parseJson(metaJson);
  const data = markdown;
  return { meta, data };
};

const parseEntry = (
  parserType: ParserType, entryDir: string, entryId: EntryId
): Entry => {
  const parse: (entryDir: string, entryId: EntryId) => RawEntry =
    parserType === 'jekyll' ? loadJekyllMarkdown : loadBbnMarkdown;
  const { meta, data } = parse(entryDir, entryId);
  if (typeof meta.minutes === 'undefined') {
    throw new Error('minutes is not defined');
  }
  if (typeof meta.pubdate === 'undefined') {
    throw new Error('pubdate is not defined');
  }
  if (typeof meta.title === 'undefined') {
    throw new Error('title is not defined');
  }
  const minutes = meta.minutes as number;
  const pubdate = meta.pubdate as string;
  const tags = (typeof meta.tags === 'undefined' ? [] : meta.tags) as string[];
  const title = meta.title as string;
  const date = parseISOString(pubdate)
    .inTimeZone('+09:00')
    .toISOString()
    .substring(0, '2006-01-02'.length);
  const html = marked(data);
  const entry = {
    id: entryId, data, date, html, minutes, pubdate, tags, title
  };
  return entry;
};

const listEntryIds = (dirOrFile: string): EntryId[] => {
  return listFiles(dirOrFile)
    .filter((file) => file.match(/(\d{4})-(\d{2})-(\d{2})(?:-(.*))?\.md$/))
    .map((file) => {
      const match = file.match(/(\d{4})-(\d{2})-(\d{2})(?:-(.*))?\.md$/);
      if (match === null) throw new Error();
      const year = match[1];
      const month = match[2];
      const date = match[3];
      const title = match[4];
      return { year, month, date, title };
    });
};

export { listEntryIds, parseEntry };
