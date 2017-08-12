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
  outDir: string
): void => {
  const linked: { [to: string]: string[]; } = {};
  repository.each((entry) => {
    const match = entry.data.match(/\[(\d\d\d\d-\d\d-\d\d)\]/g);
    if (!match) return;
    const from = `${entry.id.year}-${entry.id.month}-${entry.id.date}`;
    match.forEach((m) => {
      const matched = m.match(/\[(\d\d\d\d-\d\d-\d\d)\]/);
      if (!matched) return;
      const to = matched[1];
      if (typeof linked[to] === 'undefined') linked[to] = [];
      linked[to].push(from);
    });
  });
  const formatted = JSON.stringify(linked);
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
  { noIds, noTokensJson }: { noIds: boolean; noTokensJson: boolean; }
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
    .then(() => true ? saveLinkedJson(repository, outDir) : void 0)
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
    noTokensJson: boolean;
  }): Promise<void> => {
  console.log('DEPRECATED: Use `build()`');
  return build(inDir, outDir, options);
};

const compileOld = (inDir: string, outDir: string): Promise<void> => {
  console.log('DEPRECATED:');
  return compileImpl(inDir, outDir, listJekyll, parseJekyll, {
    noIds: false,
    noTokensJson: true
  });
};

const compileNew = compile;

const build = (
  inDir: string,
  outDir: string,
  options?: {
    noIds?: boolean;
    noTokensJson: boolean;
  }): Promise<void> => {
  const noIds = typeof options === 'undefined'
    ? false
    : typeof options.noIds === 'undefined'
      ? false
      : options.noIds;
  const noTokensJson = typeof options === 'undefined'
    ? false : options.noTokensJson;
  return compileImpl(inDir, outDir, listBbn, parseBbn, {
    noIds,
    noTokensJson
  });
};

export { compileOld, compileNew, compile, build };
