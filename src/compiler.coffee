{Promise} = require 'es6-promise'
fs = require 'fs'
marked = require 'marked'
mkdirp = require 'mkdirp'
myjekyll = require 'myjekyll'
path = require 'path'
async = require './async'

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
    async.eachSeries posts, (post) =>
      dest = path.join destDir, post.date + '.join'
      @_writeJson dest, post

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
    @_writeJson dest, data

  # <dstDir>/tags.json
  _writeTagsJson: ->
    dest = path.join @_dstDir, 'tags.json'
    tagCounts = @_blog.tagCounts()
    data = Object.keys(tagCounts).reduce (tags, tag) ->
      tags.push name: tag, count: tagCounts[tag]
    , []
    @_writeJson dest, data

  # <dstDir>/sitemap.xml
  _writeSitemapXml: ->
    dest = path.join @_dstDir, 'sitemap.xml'
    urls = @_compiledPosts.map (post) ->
      loc = 'http://blog.bouzuya.net/' + post.date.replace(/-/g, '/') + '/'
      lastmod = post.pubdate
      """
        <url>
          <loc>#{loc}</loc>
          <lastmod>#{lastmod}</lastmod>
        </url>
      """
    data = """
      <?xml version="1.0" encoding="utf-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      #{urls.join('\n')}
      </urlset>
    """
    @_writeTextFile dest, data

  # <dstDir>/atom.xml
  _writeAtomXml: ->
    limit = 20
    dest = path.join @_dstDir, 'atom.xml'
    entries = @_compiledPosts.map (post) ->
      url = 'http://blog.bouzuya.net/' + post.date.replace(/-/g, '/') + '/'
      title: post.title,
      linkHref: url,
      updated: post.pubdate,
      id: url,
      content: post.html
    .sort (a, b) ->
      # order by date desc.
      if a.updated is b.updated
        0
      else if a.updated < b.updated
        1
      else
        -1
    .slice 0, limit

    atom =
      title: 'blog.bouzuya.net'
      linkHref: 'http://blog.bouzuya.net/'
      updated: if entries.length > 0 then entries[0].updated else ''
      id: 'http://blog.bouzuya.net/'
      author:
        name: 'bouzuya'
      entries: entries

    entriesXml = atom.entries.map (entry) =>
      """
        <entry>
            <title>#{entry.title}</title>
            <link href="#{entry.linkHref}" />
            <updated>#{entry.updated}</updated>
            <id>#{entry.id}</id>
            <content type="html">#{@_escapeHtml(entry.content)}</content>
        </entry>
      """
    .join '\n'

    xml = """
      <?xml version="1.0" encoding="utf-8"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <title>#{atom.title}</title>
        <link rel="alternate" type="text/html" href="#{atom.linkHref}" />
        <updated>#{atom.updated}</updated>
        <id>#{atom.id}</id>
        <author>
          <name>#{atom.author.name}</name>
        </author>
        #{entriesXml}
      </feed>
    """
    @_writeTextFile dest, data

    _escapeHtml: (html) ->
      html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')

    _copyOtherFiles: ->
      srcFiles = @_getFiles @_srcDir
      srcFiles.forEach (file) =>
        @_copyFile file

    _writeJson: (file, data) ->
      json = JSON.stringify(data)
      @_writeTextFile file, json

    _writeTextFile: (file, data) ->
      options = encoding: 'utf-8'
      dir = path.dirname file
      unless fs.existsSync dir
        mkdirp.sync dir
      fs.writeFileSync file, data, options

    _getFiles: (file) ->
      unless !fs.statSync(file).isDirectory()
        [file]
      fs.readdirSync file
      .filter (f) -> !f.match /^_/
      .reduce (a, f) =>
        a.concat @_getFiles path.join file, f
      , []

    _copyFile: (srcPath) ->
      relativePath = path.relative @_srcDir, srcPath
      dstPath = path.resolve @_dstDir, relativePath
      dir = path.dirname dstPath
      mkdirp.sync dir unless fs.existsSync dir
      fs.writeFileSync dstPath, fs.readFileSync srcPath

module.exports = Compiler
