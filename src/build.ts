import { ParserType } from './parse';
import { formatAtom } from './format-atom';
import {
  formatAllJson,
  formatDailyJson,
  formatMonthlyJson,
  formatYearlyJson
} from './format-bbn-json';
import { formatSitemap } from './format-sitemap';
import { writeFile, path as join } from './fs';
import { Repository } from './repository';
import { tokenizer as newTokenizer, Token } from './kuromoji';

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
  repository.findAll().forEach((entry) => {
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
  const entries = repository.findAll();
  const formatted = JSON.stringify(
    entries.reduce<{ name: string; count: number; }[]>((tags, entry) => {
      return entry.tags.reduce((tags, tag) => {
        const index = tags.findIndex(({ name }) => name === tag);
        if (index >= 0) {
          const before = tags.slice(0, index);
          const oldTag = tags[index];
          const newTag = Object.assign({}, oldTag, { count: oldTag.count + 1 });
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
  const entries = repository.findAll();
  entries.forEach((entry) => {
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
  const entries = repository.findAll();
  return newTokenizer()
    .then((tokenizer) => {
      return entries.reduce((allTokens, entry) => {
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
  inDir: string, outDir: string, type: ParserType = 'default'
): Promise<void> => {
  const repository = new Repository(inDir, type);
  return Promise.resolve()
    .then(() => true ? saveYearlyJson(repository, outDir) : void 0)
    .then(() => true ? saveMonthlyJson(repository, outDir) : void 0)
    .then(() => true ? saveDailyJson(repository, outDir) : void 0)
    .then(() => true ? saveAllJson(repository, outDir) : void 0)
    .then(() => true ? saveTagsJson(repository, outDir) : void 0)
    .then(() => true ? saveAtomXml(repository, outDir) : void 0)
    .then(() => true ? saveSitemapXml(repository, outDir) : void 0)
    .then(() => true ? saveLinkedJson(repository, outDir) : void 0)
    .then(() => true ? saveTokensJson(repository, outDir) : void 0)
    .then(() => void 0);
};

const compile = (inDir: string, outDir: string): Promise<void> => {
  console.log('DEPRECATED: Use `build()`');
  return compileImpl(inDir, outDir);
};

const compileOld = (inDir: string, outDir: string): Promise<void> => {
  console.log('DEPRECATED:');
  return compileImpl(inDir, outDir, 'jekyll');
};

const compileNew = compile;

const build = compile;

export { compileOld, compileNew, compile, build };
