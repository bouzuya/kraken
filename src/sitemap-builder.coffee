module.exports = class SitemapBuilder
  constructor: (@posts) ->

  build: ->
    @posts.map (post) ->
      loc: 'http://blog.bouzuya.net/' + post.date.replace(/-/g, '/') + '/'
      lastmod: post.pubdate
