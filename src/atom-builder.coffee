module.exports = class AtomBuilder
  constructor: (@posts) ->

  build: ->
    entries = @posts.sort (a, b) ->
      # order by date desc.
      if a.updated is b.updated
        0
      else if a.updated < b.updated
        1
      else
        -1
    .filter (_, index) ->
      index < 20 # limit
    .map (post) ->
      url = 'http://blog.bouzuya.net/' + post.date.replace(/-/g, '/') + '/'
      title: post.title,
      linkHref: url,
      updated: post.pubdate,
      id: url,
      content: post.html

    atom =
      title: 'blog.bouzuya.net'
      linkHref: 'http://blog.bouzuya.net/'
      updated: entries[0]?.updated ? ''
      id: 'http://blog.bouzuya.net/'
      author:
        name: 'bouzuya'
      entries: entries
