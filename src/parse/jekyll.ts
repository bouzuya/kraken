import { parse } from 'jekyll-markdown-parser';
import { EntryId, RawEntry } from '../types';
import { path, readFile } from '../utils/fs';

const loadJekyllMarkdown = (entryDir: string, entryId: EntryId): RawEntry => {
  const { year, month, date, title } = entryId;
  const dir = path(entryDir, year, month);
  const file = path(dir, `${year}-${month}-${date}-${title}.md`);
  const jekyllMarkdown = readFile(file);
  const { markdown: data, parsedYaml: meta } = parse(jekyllMarkdown);
  return { meta, data };
};

export { loadJekyllMarkdown };
