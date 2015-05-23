{Promise} = require 'es6-promise'
fs = require 'fs-extra'
marked = require 'marked'
moment = require 'moment'
myjekyll = require 'myjekyll'
path = require 'path'
async = require './async'
AtomBuilder = require './atom-builder'
AtomFormatter = require './atom-formatter'
SitemapBuilder = require './sitemap-builder'
SitemapFormatter = require './sitemap-formatter'

class Compiler
  constructor: ({ postsDir, dstDir }) ->
    @_postsDir = postsDir
    @_dstDir = dstDir
    @_blog = {}
    @_compiledPosts = []

  compile: ->
    @_blog = myjekyll @_postsDir + '/**/*.coffee', {}
    Promise.resolve()
    .then @_compilePosts.bind @
    .then @_writeDailyPosts.bind @
    .then @_writePostsJson.bind @
    .then @_writeTagsJson.bind @
    .then @_writeSitemapXml.bind @
    .then @_writeAtomXml.bind @

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

  # <dstDir>/yyyy/mm/dd.json
  # <dstDir>/yyyy/mm/dd/index.json
  _writeDailyPosts: ->
    posts = @_compiledPosts
    dir = @_dstDir
    async.eachSeries posts, (post) ->
      d = moment post.date
      year = d.format 'YYYY'
      month = d.format 'MM'
      date = d.format 'DD'
      dest = path.join dir, year, month, date + '.join'
      fs.outputJsonSync dest, post, encoding: 'utf-8'
      dest = path.join dir, year, month, date, 'index.join'
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

module.exports = Compiler
