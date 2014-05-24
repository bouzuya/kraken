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

Compiler.prototype._copyOtherFiles = function() {
  var srcFiles = this._getFiles(this._srcDir);
  srcFiles.forEach(function(file) {
    this._copyFile(file);
  }, this);
};

Compiler.prototype._writeJson = function(file, data) {
  var json = JSON.stringify(data);
  var options = { encoding: 'utf-8' };
  var dir = Path.dirname(file);
  if (!Fs.existsSync(dir)) {
    Mkdirp.sync(dir);
  }
  return Fs.writeFileSync(file, json, options);
};

Compiler.prototype._getFiles = function(file) {
  if (!Fs.statSync(file).isDirectory()) {
    return [file];
  }
  return Fs.readdirSync(file)
  .filter(function(f) { return !f.match(/^_/); })
  .reduce(function(a, f) {
    return a.concat(this._getFiles(f));
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
