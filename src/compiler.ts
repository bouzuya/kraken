import * as marked from 'marked';
import * as moment from 'moment';
import * as myjekyll from 'myjekyll';
import * as path from 'path';
import { formatAtom } from './format-atom';
import { formatDailyJson, formatMonthlyJson } from './format-bbn-json';
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
    this._blog = myjekyll(this._postsDir + '/**/*.md', {});
    return Promise.resolve()
      .then(this._compilePosts.bind(this))
      .then(this._writeYearlyPosts.bind(this))
      .then(this._writeAllPosts.bind(this))
      .then(this._writeTagsJson.bind(this))
      .then(this._writeSitemapXml.bind(this))
      .then(this._writeAtomXml.bind(this));
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

  _writeYearlyPosts(): void {
    const yearlyPosts: { [year: string]: CompiledEntry[]; } = this._compiledPosts.reduce<{ [year: string]: CompiledEntry[]; }>(
      (r, post) => {
        const d = moment(post.date);
        const y = d.format('YYYY');
        if (r[y] == null) {
          r[y] = [];
        }
        r[y].push(post);
        return r;
      }, {});
    const dir = this._dstDir;
    for (const year in yearlyPosts) {
      const posts = yearlyPosts[year];
      const dest1 = path.join(dir, year + '.json');
      writeFile(dest1, formatJson(posts));
      const dest2 = path.join(dir, year, 'index.json');
      writeFile(dest2, formatJson(posts));
    }
  }

  _writeAllPosts(): void {
    const posts = this._compiledPosts;
    const dest = path.join(this._dstDir, 'posts.json');
    const data = posts.map((i) => {
      if (i.minutes == null) {
        throw new Error(i.date + " minutes is not defined.");
      }
      return {
        date: i.date,
        minutes: i.minutes,
        pubdate: i.pubdate,
        tags: i.tags,
        title: i.title
      };
    });
    writeFile(dest, formatJson(data));
  }

  _writeTagsJson(): void {
    const dest = path.join(this._dstDir, 'tags.json');
    const tagCounts = this._blog.tagCounts();
    const data = Object.keys(tagCounts)
      .reduce<{ name: string; count: number; }[]>((tags, tag) => {
        tags.push({
          name: tag,
          count: tagCounts[tag]
        });
        return tags;
      }, []);
    writeFile(dest, formatJson(data));
  }

  _writeSitemapXml(): void {
    const dest = path.join(this._dstDir, 'sitemap.xml');
    const entries = this._compiledPosts;
    const formatted = formatSitemap(entries);
    writeFile(dest, formatted);
  }

  _writeAtomXml(): void {
    const dest = path.join(this._dstDir, 'atom.xml');
    const entries = this._compiledPosts;
    const formatted = formatAtom(entries);
    writeFile(dest, formatted);
  }
}
