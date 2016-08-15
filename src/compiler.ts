import * as fs from 'fs-extra';
import * as marked from 'marked';
import * as moment from 'moment';
import * as myjekyll from 'myjekyll';
import * as path from 'path';
import * as async from './async';
import { AtomBuilder } from './atom-builder';
import { AtomFormatter } from './atom-formatter';
import { Promise } from './globals';
import { SitemapBuilder } from './sitemap-builder';
import { SitemapFormatter } from './sitemap-formatter';

fs.jsonfile.spaces = null;

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

type CompiledEntry = {
  data: string;
  date: string;
  minutes: number;
  pubdate: string;
  tags: string;
  title: string;
  html: string;
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
    this._blog = myjekyll(this._postsDir + '/**/*.md', {});
    return Promise.resolve()
      .then(this._compilePosts.bind(this))
      .then(this._writeDailyPosts.bind(this))
      .then(this._writeMonthlyPosts.bind(this))
      .then(this._writeYearlyPosts.bind(this))
      .then(this._writeAllPosts.bind(this))
      .then(this._writeTagsJson.bind(this))
      .then(this._writeSitemapXml.bind(this))
      .then(this._writeAtomXml.bind(this));
  }

  _compilePosts() {
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

  _writeDailyPosts() {
    const posts = this._compiledPosts;
    const dir = this._dstDir;
    return async.eachSeries(posts, function (post) {
      var dest: string;
      const d = moment(post.date);
      const year = d.format('YYYY');
      const month = d.format('MM');
      const date = d.format('DD');
      dest = path.join(dir, year, month, date + '.json');
      fs.outputJsonSync(dest, post, {
        encoding: 'utf-8'
      });
      dest = path.join(dir, year, month, date, 'index.json');
      return fs.outputJsonSync(dest, post, {
        encoding: 'utf-8'
      });
    });
  }

  _writeMonthlyPosts() {
    const monthlyPosts: { [ym: string]: CompiledEntry[]; } =
      this._compiledPosts.reduce<{ [ym: string]: CompiledEntry[]; }>(
        (r, post) => {
          const d = moment(post.date);
          const ym = d.format('YYYY/MM');
          if (r[ym] == null) {
            r[ym] = [];
          }
          r[ym].push(post);
          return r;
        }, {});
    const dir = this._dstDir;
    const results: string[] = [];
    for (const ym in monthlyPosts) {
      const posts = monthlyPosts[ym];
      const [year, month] = ym.split('/');
      let dest = path.join(dir, year, month + '.json');
      fs.outputJsonSync(dest, posts, {
        encoding: 'utf-8'
      });
      dest = path.join(dir, year, month, 'index.json');
      results.push(fs.outputJsonSync(dest, posts, {
        encoding: 'utf-8'
      }));
    }
    return results;
  }

  _writeYearlyPosts() {
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
    const results: string[] = [];
    for (const year in yearlyPosts) {
      const posts = yearlyPosts[year];
      let dest = path.join(dir, year + '.json');
      fs.outputJsonSync(dest, posts, {
        encoding: 'utf-8'
      });
      dest = path.join(dir, year, 'index.json');
      results.push(fs.outputJsonSync(dest, posts, {
        encoding: 'utf-8'
      }));
    }
    return results;
  }

  _writeAllPosts() {
    const posts = this._compiledPosts;
    const dest = path.join(this._dstDir, 'posts.json');
    const data = posts.map(function (i) {
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
    return fs.outputJsonSync(dest, data, {
      encoding: 'utf-8'
    });
  }

  _writeTagsJson() {
    const dest = path.join(this._dstDir, 'tags.json');
    const tagCounts = this._blog.tagCounts();
    const data = Object.keys(tagCounts)
      .reduce<{ name: string; count: number; }[]>(function (tags, tag) {
        tags.push({
          name: tag,
          count: tagCounts[tag]
        });
        return tags;
      }, []);
    return fs.outputJsonSync(dest, data, {
      encoding: 'utf-8'
    });
  }

  _writeSitemapXml() {
    const dest = path.join(this._dstDir, 'sitemap.xml');
    const sitemap = new SitemapBuilder(this._compiledPosts).build();
    const formatter = new SitemapFormatter(sitemap);
    const data = formatter.format();
    return fs.outputFileSync(dest, data, {
      encoding: 'utf-8'
    });
  }

  _writeAtomXml() {
    const dest = path.join(this._dstDir, 'atom.xml');
    const atom = new AtomBuilder(this._compiledPosts).build();
    const formatter = new AtomFormatter(atom);
    const data = formatter.format();
    return fs.outputFileSync(dest, data, {
      encoding: 'utf-8'
    });
  }
}
