import { Promise } from 'es6-promise';
import * as fs from 'fs-extra';
import * as marked from 'marked';
import * as moment from 'moment';
import * as myjekyll from 'myjekyll';
import * as path from 'path';
import * as async from './async';
import { AtomBuilder } from './atom-builder';
import { AtomFormatter } from './atom-formatter';
import { SitemapBuilder } from './sitemap-builder';
import { SitemapFormatter } from './sitemap-formatter';

var AtomBuilder, AtomFormatter, Compiler, SitemapBuilder, SitemapFormatter;

fs.jsonfile.spaces = null;

Compiler = (function() {
  function Compiler(arg) {
    var dstDir, postsDir;
    postsDir = arg.postsDir, dstDir = arg.dstDir;
    this._postsDir = postsDir;
    this._dstDir = dstDir;
    this._blog = {};
    this._compiledPosts = [];
  }

  Compiler.prototype.compile = function() {
    this._blog = myjekyll(this._postsDir + '/**/*.md', {});
    return Promise.resolve().then(this._compilePosts.bind(this)).then(this._writeDailyPosts.bind(this)).then(this._writeMonthlyPosts.bind(this)).then(this._writeYearlyPosts.bind(this)).then(this._writeAllPosts.bind(this)).then(this._writeTagsJson.bind(this)).then(this._writeSitemapXml.bind(this)).then(this._writeAtomXml.bind(this));
  };

  Compiler.prototype._compilePosts = function() {
    return this._compiledPosts = this._blog.entries().map(function(entry) {
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
  };

  Compiler.prototype._writeDailyPosts = function() {
    var dir, posts;
    posts = this._compiledPosts;
    dir = this._dstDir;
    return async.eachSeries(posts, function(post) {
      var d, date, dest, month, year;
      d = moment(post.date);
      year = d.format('YYYY');
      month = d.format('MM');
      date = d.format('DD');
      dest = path.join(dir, year, month, date + '.json');
      fs.outputJsonSync(dest, post, {
        encoding: 'utf-8'
      });
      dest = path.join(dir, year, month, date, 'index.json');
      return fs.outputJsonSync(dest, post, {
        encoding: 'utf-8'
      });
    });
  };

  Compiler.prototype._writeMonthlyPosts = function() {
    var dest, dir, month, monthlyPosts, posts, ref, results, year, ym;
    monthlyPosts = this._compiledPosts.reduce(function(r, post) {
      var d, ym;
      d = moment(post.date);
      ym = d.format('YYYY/MM');
      if (r[ym] == null) {
        r[ym] = [];
      }
      r[ym].push(post);
      return r;
    }, {});
    dir = this._dstDir;
    results = [];
    for (ym in monthlyPosts) {
      posts = monthlyPosts[ym];
      ref = ym.split('/'), year = ref[0], month = ref[1];
      dest = path.join(dir, year, month + '.json');
      fs.outputJsonSync(dest, posts, {
        encoding: 'utf-8'
      });
      dest = path.join(dir, year, month, 'index.json');
      results.push(fs.outputJsonSync(dest, posts, {
        encoding: 'utf-8'
      }));
    }
    return results;
  };

  Compiler.prototype._writeYearlyPosts = function() {
    var dest, dir, posts, results, year, yearlyPosts;
    yearlyPosts = this._compiledPosts.reduce(function(r, post) {
      var d, y;
      d = moment(post.date);
      y = d.format('YYYY');
      if (r[y] == null) {
        r[y] = [];
      }
      r[y].push(post);
      return r;
    }, {});
    dir = this._dstDir;
    results = [];
    for (year in yearlyPosts) {
      posts = yearlyPosts[year];
      dest = path.join(dir, year + '.json');
      fs.outputJsonSync(dest, posts, {
        encoding: 'utf-8'
      });
      dest = path.join(dir, year, 'index.json');
      results.push(fs.outputJsonSync(dest, posts, {
        encoding: 'utf-8'
      }));
    }
    return results;
  };

  Compiler.prototype._writeAllPosts = function() {
    var data, dest, posts;
    posts = this._compiledPosts;
    dest = path.join(this._dstDir, 'posts.json');
    data = posts.map(function(i) {
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
  };

  Compiler.prototype._writeTagsJson = function() {
    var data, dest, tagCounts;
    dest = path.join(this._dstDir, 'tags.json');
    tagCounts = this._blog.tagCounts();
    data = Object.keys(tagCounts).reduce(function(tags, tag) {
      tags.push({
        name: tag,
        count: tagCounts[tag]
      });
      return tags;
    }, []);
    return fs.outputJsonSync(dest, data, {
      encoding: 'utf-8'
    });
  };

  Compiler.prototype._writeSitemapXml = function() {
    var data, dest, formatter, sitemap;
    dest = path.join(this._dstDir, 'sitemap.xml');
    sitemap = new SitemapBuilder(this._compiledPosts).build();
    formatter = new SitemapFormatter(sitemap);
    data = formatter.format();
    return fs.outputFileSync(dest, data, {
      encoding: 'utf-8'
    });
  };

  Compiler.prototype._writeAtomXml = function() {
    var atom, data, dest, formatter;
    dest = path.join(this._dstDir, 'atom.xml');
    atom = new AtomBuilder(this._compiledPosts).build();
    formatter = new AtomFormatter(atom);
    data = formatter.format();
    return fs.outputFileSync(dest, data, {
      encoding: 'utf-8'
    });
  };

  return Compiler;

})();

export { Compiler };
