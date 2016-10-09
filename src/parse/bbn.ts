import { EntryId, RawEntry } from '../types';
import { parseJson, path, readFile } from '../utils/fs';

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

export { loadBbnMarkdown };
