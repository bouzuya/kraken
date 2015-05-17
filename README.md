Kraken
==============================================================================

**DEPRECATED**: Kraken has been integrated into the [bouzuya/bbn-react][]

[bouzuya/bbn-react]: https://github.com/bouzuya/bbn-react

Kraken is a blog generator for [bouzuya](http://bouzuya.net/).

Installation
------------------------------------------------------------------------------

    $ npm install bouzuya/kraken

Usage
------------------------------------------------------------------------------

    $ # before
    $ cat src/_posts/2014-01-01-diary.markdown
    ---
    title: hoge
    tags: [diary]
    ---
    i love munchkin.

    $ # generate blog
    $ kraken

    $ # after
    $ cat build/posts/2014-04-01.json
    {"title":"hoge","tags":["diary"],"data":"i love munchkin.","html":"<p>i love munchkin.</p>\n\n"}

License
------------------------------------------------------------------------------

MIT

Note
------------------------------------------------------------------------------

- SPA: Single Page Application.
- All entries are written in [Markdown](http://daringfireball.net/projects/markdown/syntax).
- All entries are compiled to JSON format.
- 1 entry/day.
- http://example.com/yyyy/mm/dd/
- post:
  - file
  - pubdate
  - title
  - body
  - tags
  - minutes

Badges
------------------------------------------------------------------------------

[![Build Status](https://travis-ci.org/bouzuya/kraken.svg)](https://travis-ci.org/bouzuya/kraken)
