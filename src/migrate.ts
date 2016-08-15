import { formatJson, path, writeFile } from './fs';
import { listEntryIds, parseEntry } from './parse';

const migrate = (inDir: string, outDir: string): void => {
  listEntryIds(inDir)
    .forEach((id) => {
      const entry = parseEntry('jekyll', inDir, id);
      const data = entry.data;
      const meta = {
        minutes: entry.minutes,
        pubdate: entry.pubdate,
        tags: entry.tags,
        title: entry.title
      };
      const dir = path(outDir, id.year, id.month);
      const baseName = (typeof id.title === 'undefined' || id.title === 'diary')
        ? `${id.year}-${id.month}-${id.date}`
        : `${id.year}-${id.month}-${id.date}-${id.title}`;
      const metaFile = path(dir, `${baseName}.json`);
      const dataFile = path(dir, `${baseName}.md`);
      writeFile(metaFile, formatJson(meta, 2));
      writeFile(dataFile, data);
    });
};

export { migrate };
