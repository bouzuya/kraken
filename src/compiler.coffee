{Promise} = require 'es6-promise'
fs = require 'fs-extra'
marked = require 'marked'
myjekyll = require 'myjekyll'
path = require 'path'
async = require './async'
AtomBuilder = require './atom-builder'
AtomFormatter = require './atom-formatter'
SitemapBuilder = require './sitemap-builder'
SitemapFormatter = require './sitemap-formatter'

class Compiler
  constructor: ({ srcDir, postsDir, dstDir }) ->
    @_srcDir = srcDir
    @_postsDir = postsDir
    @_dstDir = dstDir
    @_blog = {}
    @_compiledPosts = []

  compile: ->
    @_blog = myjekyll { dir: @_postsDir }
    Promise.resolve()
    .then @_compilePosts.bind @
    .then @_writePosts.bind @
    .then @_writePostsJson.bind @
    .then @_writeTagsJson.bind @
    .then @_writeSitemapXml.bind @
    .then @_writeAtomXml.bind @
    .then @_copyOtherFiles.bind @

  _compilePosts: ->
    @_compiledPosts = @_blog.entries()
    .map (entry) ->
      data: entry.content
      date: entry.file.replace /^(\d{4}-\d{2}-\d{2})-.*$/, '$1'
      html: marked entry.content
      minutes: entry.minutes
      pubdate: entry.pubdate
      tags: entry.tags
      title: entry.title

  # <dstDir>/posts/yyyy-mm-dd.json
  _writePosts: ->
    posts = @_compiledPosts
    destDir = path.join @_dstDir, 'posts'
    async.eachSeries posts, (post) ->
      dest = path.join destDir, post.date + '.join'
      fs.outputJsonSync dest, post, encoding: 'utf-8'

  # <dstDir>/posts.json
  _writePostsJson: ->
    posts = @_compiledPosts
    dest = path.join @_dstDir, 'posts.json'
    data = posts.map (i) ->
      throw new Error "#{i.date} minutes is not defined." unless i.minutes?
      date: i.date
      minutes: i.minutes
      pubdate: i.pubdate
      tags: i.tags
      title: i.title
    fs.outputJsonSync dest, data, encoding: 'utf-8'

  # <dstDir>/tags.json
  _writeTagsJson: ->
    dest = path.join @_dstDir, 'tags.json'
    tagCounts = @_blog.tagCounts()
    data = Object.keys(tagCounts).reduce (tags, tag) ->
      tags.push name: tag, count: tagCounts[tag]
    , []
    fs.outputJsonSync dest, data, encoding: 'utf-8'

  # <dstDir>/sitemap.xml
  _writeSitemapXml: ->
    dest = path.join @_dstDir, 'sitemap.xml'
    sitemap = new SitemapBuilder(@_compiledPosts).build()
    formatter = new SitemapFormatter sitemap
    data = formatter.format()
    fs.outputFileSync dest, data, encoding: 'utf-8'

  # <dstDir>/atom.xml
  _writeAtomXml: ->
    dest = path.join @_dstDir, 'atom.xml'
    atom = new AtomBuilder(@_compiledPosts).build()
    formatter = new AtomFormatter atom
    data = formatter.format()
    fs.outputFileSync dest, data, encoding: 'utf-8'

  _copyOtherFiles: ->
    srcFiles = @_getFiles @_srcDir
    srcFiles.forEach (srcPath) =>
      relativePath = path.relative @_srcDir, srcPath
      dstPath = path.resolve @_dstDir, relativePath
      fs.copyFileSync srcPath, dstPath

  _getFiles: (file) ->
    return [file] unless fs.statSync(file).isDirectory()
    fs.readdirSync file
    .filter (f) -> !f.match /^_/
    .reduce (a, f) =>
      a.concat @_getFiles path.join file, f
    , []

module.exports = Compiler
