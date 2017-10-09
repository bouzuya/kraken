import { Entry, EntryId } from '../types';
import {
  listEntryIds as listBbn,
  parseEntry as parseBbn
} from '../parse/bbn';
import {
  listEntryIds as listJekyll,
  parseEntry as parseJekyll
} from '../parse/jekyll';
import {
  formatAtom,
  formatAllJson,
  formatDailyJson,
  formatMonthlyJson,
  formatYearlyJson,
  formatSitemap
} from '../format';
import { writeFile, path as join } from '../utils/fs';
import { Repository } from '../repository';
import { tokenizer as newTokenizer, Token } from '../utils/kuromoji';

export type CompiledEntry = {
  data: string;
  date: string;
  minutes: number;
  pubdate: string;
  tags: string;
  title: string;
  html: string;
};

const saveDailyJson = (
  repository: Repository,
  outDir: string
): void => {
  repository.each((entry) => {
    const { id } = entry;
    const title = typeof id.title === 'undefined' ? 'diary' : id.title;
    const formatted = formatDailyJson(entry);
    [
      `${id.year}/${id.month}/${id.date}.json`,
      `${id.year}/${id.month}/${id.date}/index.json`,
      `${id.year}/${id.month}/${id.date}/${title}.json`,
      `${id.year}/${id.month}/${id.date}/${title}/index.json`
    ].forEach((file) => {
      writeFile(join(outDir, file), formatted);
    });
  });
};

const saveMonthlyJson = (
  repository: Repository,
  outDir: string
): void => {
  repository.getYears().forEach((year) => {
    repository.getMonths(year).forEach((month) => {
      const entries = repository.findBy({ year, month });
      const formatted = formatMonthlyJson(entries);
      [
        `${year}/${month}.json`,
        `${year}/${month}/index.json`
      ].forEach((file) => {
        writeFile(join(outDir, file), formatted);
      });
    });
  });
};

const saveYearlyJson = (
  repository: Repository,
  outDir: string
): void => {
  repository.getYears().forEach((y) => {
    const entries = repository.findBy({ year: y });
    const formatted = formatYearlyJson(entries);
    [
      `${y}.json`,
      `${y}/index.json`
    ].forEach((file) => {
      writeFile(join(outDir, file), formatted);
    });
  });
};

const saveAllJson = (
  repository: Repository,
  outDir: string
): void => {
  const entries = repository.findAll();
  const formatted = formatAllJson(entries);
  writeFile(join(outDir, 'posts.json'), formatted);
};

const saveTagsJson = (
  repository: Repository,
  outDir: string
): void => {
  const formatted = JSON.stringify(
    repository.reduce<{ name: string; count: number; }[]>(
      (tags, { tags: entryTags }) => {
        return entryTags.reduce((tags, tag) => {
          const index = tags.findIndex(({ name }) => name === tag);
          if (index >= 0) {
            const before = tags.slice(0, index);
            const oldTag = tags[index];
            const newTag = Object.assign(
              {}, oldTag, { count: oldTag.count + 1 });
            const after = tags.slice(index + 1);
            return before.concat([newTag]).concat(after);
          } else {
            return tags.concat([{ name: tag, count: 1 }]);
          }
        }, tags);
      }, []));
  writeFile(join(outDir, 'tags.json'), formatted);
};

const saveAtomXml = (
  repository: Repository,
  outDir: string
): void => {
  const entries = repository.findAll();
  const formatted = formatAtom(entries);
  writeFile(join(outDir, 'atom.xml'), formatted);
};

const saveSitemapXml = (
  repository: Repository,
  outDir: string
): void => {
  const entries = repository.findAll();
  const formatted = formatSitemap(entries);
  writeFile(join(outDir, 'sitemap.xml'), formatted);
};

const saveLinkedJson = (
  repository: Repository,
  outDir: string,
  within: number
): void => {
  const idString = ({ year, month, date }: EntryId): string => `${year}-${month}-${date}`;
  const sameDays: { [mmdd: string]: string[]; } = {};
  const inbounds: { [to: string]: string[]; } = {};
  const outbounds: { [from: string]: string[]; } = {};
  repository.each((entry) => {
    const match = entry.data.match(/\[(\d\d\d\d-\d\d-\d\d)\]/g);
    if (match === null) return;
    const from = idString(entry.id);
    const outbound = match
      .map((m) => m.match(/\[(\d\d\d\d-\d\d-\d\d)\]/))
      .filter((m): m is RegExpMatchArray => m !== null)
      .map(([_, to]: RegExpMatchArray) => to); // workaround for `filter` type
    outbound.forEach((to) => {
      if (typeof inbounds[to] === 'undefined') inbounds[to] = [];
      inbounds[to].push(from);
    });
    outbounds[from] = outbound;
    const mmdd = `--${entry.id.month}-${entry.id.date}`;
    if (typeof sameDays[mmdd] === 'undefined') sameDays[mmdd] = [];
    sameDays[mmdd].push(from);
  });

  const entryIds = repository.getEntryIds();
  entryIds.forEach((entryId, index) => {
    const { year, month, date } = entryId;
    const id = idString(entryId);
    const mmdd = `--${entryId.month}-${entryId.date}`;
    const n = within;
    const prev = entryIds
      .slice(Math.max(0, index - n), index)
      .map((entryId) => idString(entryId))
      .sort((a, b) => a < b ? 1 : (a === b ? 0 : -1));
    const next = entryIds
      .slice(index + 1, Math.min(entryIds.length, index + n + 1))
      .map((entryId) => idString(entryId))
      .sort((a, b) => a < b ? 1 : (a === b ? 0 : -1));
    const inbound = typeof inbounds[id] === 'undefined' ? [] : inbounds[id];
    const outbound = typeof outbounds[id] === 'undefined' ? [] : outbounds[id];
    const sameDays_ = typeof sameDays[mmdd] === 'undefined' ? [] : sameDays[mmdd];
    const formatted = JSON.stringify({ inbound, next, outbound, prev, same: sameDays_ });
    writeFile(join(outDir, year, month, date, 'related.json'), formatted);
    writeFile(join(outDir, year, month, date, 'related', 'index.json'), formatted);
  });
  const formatted = JSON.stringify(inbounds);
  writeFile(join(outDir, 'linked.json'), formatted);
};

const saveTokensJson = (
  repository: Repository, outDir: string
): Promise<void> => {
  return newTokenizer()
    .then((tokenizer) => {
      return repository.reduce((allTokens, entry) => {
        const id = `${entry.id.year}-${entry.id.month}-${entry.id.date}`;
        const tokens = tokenizer.tokenize(entry.data);
        allTokens[id] = tokens;
        return allTokens;
      }, <{ [to: string]: Token[] }>{});
    })
    .then((tokens) => {
      const formatted = JSON.stringify(tokens, null, 2);
      writeFile(join(outDir, 'tokens.json'), formatted);
    });
};

const compileImpl = (
  inDir: string,
  outDir: string,
  list: (dir: string) => EntryId[],
  parse: (entryDir: string, entryId: EntryId, options?: { noIds: boolean; }) => Entry,
  { noIds, noTokensJson, within }: { noIds: boolean; noTokensJson: boolean; within: number; }
): Promise<void> => {
  const repository = new Repository(inDir, list, (d, i) => parse(d, i, { noIds }));
  return Promise.resolve()
    .then(() => true ? saveYearlyJson(repository, outDir) : void 0)
    .then(() => true ? saveMonthlyJson(repository, outDir) : void 0)
    .then(() => true ? saveDailyJson(repository, outDir) : void 0)
    .then(() => true ? saveAllJson(repository, outDir) : void 0)
    .then(() => true ? saveTagsJson(repository, outDir) : void 0)
    .then(() => true ? saveAtomXml(repository, outDir) : void 0)
    .then(() => true ? saveSitemapXml(repository, outDir) : void 0)
    .then(() => true ? saveLinkedJson(repository, outDir, within) : void 0)
    .then(() => {
      return noTokensJson === false
        ? saveTokensJson(repository, outDir) : void 0;
    })
    .then(() => void 0);
};

const compile = (
  inDir: string,
  outDir: string,
  options?: {
    noIds?: boolean;
    noTokensJson?: boolean;
    within?: number;
  }): Promise<void> => {
  console.log('DEPRECATED: Use `build()`');
  return build(inDir, outDir, options);
};

const compileOld = (inDir: string, outDir: string): Promise<void> => {
  console.log('DEPRECATED:');
  return compileImpl(inDir, outDir, listJekyll, parseJekyll, {
    noIds: false,
    noTokensJson: true,
    within: 4
  });
};

const compileNew = compile;

const build = (
  inDir: string,
  outDir: string,
  options?: {
    noIds?: boolean;
    noTokensJson?: boolean;
    within?: number;
  }): Promise<void> => {
  const noIds = typeof options === 'undefined'
    ? false
    : typeof options.noIds === 'undefined'
      ? false
      : options.noIds;
  const noTokensJson = typeof options === 'undefined'
    ? false
    : typeof options.noTokensJson === 'undefined'
      ? false
      : options.noTokensJson;
  const within = typeof options === 'undefined'
    ? 4
    : typeof options.within === 'undefined'
      ? 4
      : options.within;
  return compileImpl(inDir, outDir, listBbn, parseBbn, {
    noIds,
    noTokensJson,
    within
  });
};

export { compileOld, compileNew, compile, build };
