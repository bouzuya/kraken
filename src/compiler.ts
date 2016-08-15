import * as marked from 'marked';
import * as moment from 'moment';
import * as myjekyll from 'myjekyll';
import * as path from 'path';
import { formatAtom } from './format-atom';
import {
  formatAllJson,
  formatDailyJson,
  formatMonthlyJson,
  formatYearlyJson
} from './format-bbn-json';
import { formatSitemap } from './format-sitemap';
import { Promise } from './globals';
import { formatJson, writeFile, path as join } from './fs';
import { Repository } from './repository';

type MyJekyll = {
  entries: () => Entry[];
  tagCounts: () => { [tag: string]: number };
};

type Entry = {
  content: string;
  file: string;
  minutes: number;
  pubdate: string;
  tags: string;
  title: string;
};

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

export class Compiler {
  private _postsDir: string;
  private _dstDir: string;
  private _blog: MyJekyll;
  private _compiledPosts: CompiledEntry[];

  constructor({ dstDir, postsDir }: { dstDir: string; postsDir: string; }) {
    this._postsDir = postsDir;
    this._dstDir = dstDir;
    // this._blog = {};
    this._compiledPosts = [];
  }

  compile(): Promise<void> {
    const repository = new Repository(this._postsDir);
    saveDailyJson(repository, this._dstDir);
    saveMonthlyJson(repository, this._dstDir);
    saveYearlyJson(repository, this._dstDir);
    saveAllJson(repository, this._dstDir);
    saveTagsJson(repository, this._dstDir);
    saveAtomXml(repository, this._dstDir);
    this._blog = myjekyll(this._postsDir + '/**/*.md', {});
    return Promise.resolve()
      .then(this._compilePosts.bind(this))
      .then(this._writeSitemapXml.bind(this));
  }

  _compilePosts(): CompiledEntry[] {
    return this._compiledPosts = this._blog.entries().map((entry) => {
      return {
        data: entry.content,
        date: entry.file.replace(/^(\d{4}-\d{2}-\d{2})-.*$/, '$1'),
        html: marked(entry.content),
        minutes: entry.minutes,
        pubdate: entry.pubdate,
        tags: entry.tags,
        title: entry.title
      };
    });
  }

  _writeSitemapXml(): void {
    const dest = path.join(this._dstDir, 'sitemap.xml');
    const entries = this._compiledPosts;
    const formatted = formatSitemap(entries);
    writeFile(dest, formatted);
  }
}
