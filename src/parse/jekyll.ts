import { parse } from 'jekyll-markdown-parser';
import { listEntryIds, parseEntry as parseEntryBase } from './base';
import { Entry, EntryId, RawEntry } from '../types';
import { path, readFile } from '../utils/fs';

const loadJekyllMarkdown = (entryDir: string, entryId: EntryId): RawEntry => {
  const { year, month, date, title } = entryId;
  const dir = path(entryDir, year, month);
  const file = path(dir, `${year}-${month}-${date}-${title}.md`);
  const jekyllMarkdown = readFile(file);
  const { markdown: data, parsedYaml: meta } = parse(jekyllMarkdown);
  return { meta, data };
};

const parseEntry = (entryDir: string, entryId: EntryId, options?: { noIds: boolean; }): Entry => {
  const parseOptions = typeof options === 'undefined'
    ? { noIds: false }
    : options;
  return parseEntryBase(entryDir, entryId, loadJekyllMarkdown, parseOptions);
};

export { listEntryIds, parseEntry };
