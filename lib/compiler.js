var Async = require('./async');
var Fs = require('fs');
var Markdown = require('markdown').markdown;
var Mkdirp = require('mkdirp');
var Path = require('path');
var Promise = require('q').Promise;
var myjekyll = require('myjekyll');

var Compiler = function(options) {
  this._srcDir = options.srcDir;
  this._postsDir = options.postsDir;
  this._dstDir = options.dstDir;
  this._blog = {};
  this._compiledPosts = [];
};

Compiler.prototype.compile = function() {
  this._blog = myjekyll({ dir: this._postsDir });
  return new Promise(function(resolve) { resolve(); })
  .then(this._compilePosts.bind(this))
  .then(this._writePosts.bind(this))
  .then(this._writePostsJson.bind(this))
  .then(this._writeTagsJson.bind(this))
  .then(this._writeAtomXml.bind(this))
  .then(this._copyOtherFiles.bind(this));
};

Compiler.prototype._compilePosts = function() {
  this._compiledPosts = this._blog.entries()
  .map(function(entry) {
    return {
      pubdate: entry.pubdate,
      title: entry.title,
      tags: entry.tags,
      minutes: entry.minutes,
      data: entry.content,
      date: entry.file.replace(/^(\d{4}-\d{2}-\d{2})-.*$/, '$1')
    };
  })
  .map(function(post) {
    post.html = Markdown.toHTML(post.data);
    return post;
  });
};

// write <dstDir>/posts/yyyy-mm-dd.json
Compiler.prototype._writePosts = function() {
  var posts = this._compiledPosts;
  var destDir = Path.join(this._dstDir, 'posts');
  return Async.eachSeries(posts, function(post) {
    var dest = Path.join(destDir, post.date + '.json');
    return this._writeJson(dest, post);
  }.bind(this));
};

// write <dstDir>/posts.json
Compiler.prototype._writePostsJson = function() {
  var posts = this._compiledPosts;
  var dest = Path.join(this._dstDir, 'posts.json');
  var data = posts.map(function(post) {
    return {
      pubdate: post.pubdate,
      title: post.title,
      tags: post.tags,
      minutes: post.minutes,
      date: post.date
    };
  });
  return this._writeJson(dest, data);
};

// write <dstDir>/tags.json
Compiler.prototype._writeTagsJson = function() {
  var dest = Path.join(this._dstDir, 'tags.json');
  var data = this._blog.tags();
  return this._writeJson(dest, data);
};

// write <dstDir>/atom.xml
Compiler.prototype._writeAtomXml = function() {
  var limit = 20;
  var dest = Path.join(this._dstDir, 'atom.xml');
  var entries = this._compiledPosts.map(function(post) {
    var url = 'http://blog.bouzuya.net/' + post.date.replace(/-/g, '/') + '/';
    return {
      title: post.title,
      linkHref: url,
      updated: post.pubdate,
      id: url,
      content: post.html
    };
  }).sort(function(a, b) {
     // order by date desc.
    return a.updated === b.updated ? 0 : a.updated < b.updated ? 1 : -1;
  }).slice(0, limit);

  var atom = {
    title: 'blog.bouzuya.net',
    linkHref: 'http://blog.bouzuya.net/',
    updated: entries.length > 0 ? entries[0].updated : '',
    id: 'http://blog.bouzuya.net/',
    author: {
      name: 'bouzuya'
    },
    entries: entries
  };

  var xml = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<feed xmlns="http://www.w3.org/2005/Atom">',
    '    <title>' + atom.title + '</title>',
    '    <link rel="alternate" type="text/html" href="' + atom.linkHref + '}" />',
    '    <updated>' + atom.updated + '</updated>',
    '    <id>' + atom.id + '</id>',
    '    <author>',
    '        <name>' + atom.author.name + '</name>',
    '    </author>'
  ];
  atom.entries.forEach(function(entry) {
    xml.push([
      '    <entry>',
      '        <title>' + entry.title + '</title>',
      '        <link href="' + entry.linkHref + '" />',
      '        <updated>' + entry.updated + '</updated>',
      '        <id>' + entry.id + '</id>',
      '        <content type="html">' + this._escapeHtml(entry.content) + '</content>',
      '    </entry>',
    ].join('\n'));
  }.bind(this));
  xml.push('</feed>');
  var data = xml.join('\n');
  return this._writeTextFile(dest, data);
};

Compiler.prototype._escapeHtml = function(html) {
  return html
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');
};

Compiler.prototype._copyOtherFiles = function() {
  var srcFiles = this._getFiles(this._srcDir);
  srcFiles.forEach(function(file) {
    this._copyFile(file);
  }, this);
};

Compiler.prototype._writeJson = function(file, data) {
  var json = JSON.stringify(data);
  return this._writeTextFile(file, json);
};

Compiler.prototype._writeTextFile = function(file, data) {
  var options = { encoding: 'utf-8' };
  var dir = Path.dirname(file);
  if (!Fs.existsSync(dir)) {
    Mkdirp.sync(dir);
  }
  return Fs.writeFileSync(file, data, options);
};

Compiler.prototype._getFiles = function(file) {
  if (!Fs.statSync(file).isDirectory()) {
    return [file];
  }
  return Fs.readdirSync(file)
  .filter(function(f) { return !f.match(/^_/); })
  .reduce(function(a, f) {
    return a.concat(this._getFiles(Path.join(file, f)));
  }.bind(this), []);
};

Compiler.prototype._copyFile = function(srcPath) {
  var relativePath = Path.relative(this._srcDir, srcPath);
  var dstPath = Path.resolve(this._dstDir, relativePath);
  var dir = Path.dirname(dstPath);
  if (!Fs.existsSync(dir)) {
    Mkdirp.sync(dir);
  }
  Fs.writeFileSync(dstPath, Fs.readFileSync(srcPath));
};

module.exports = Compiler;
