import { Entry, EntryId, RawEntry } from '../types';
import { listFiles } from '../utils/fs';
import { parseISOString } from 'time-keeper';
import * as marked from 'marked';

const parseEntry = (
  entryDir: string,
  entryId: EntryId,
  parseRaw: (entryDir: string, entryId: EntryId) => RawEntry,
  options: { noIds: boolean; }
): Entry => {
  const { meta, data } = parseRaw(entryDir, entryId);
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
  const renderer = new marked.Renderer();
  if (options.noIds) {
    renderer.heading = (text, level) => `<h${level}>${text}</h${level}>\n`;
  }
  const html = marked(data, { renderer });
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
