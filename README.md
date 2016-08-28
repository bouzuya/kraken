![kraken](https://cloud.githubusercontent.com/assets/1221346/17460910/189fabd0-5cb4-11e6-83b6-bc8122c7557a.png)

kraken: A blog data generator for [blog.bouzuya.net](http://blog.bouzuya.net/).

See: [bouzuya/blog.bouzuya.net][]

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

## Badges

[![Travis CI][travisci-badge-url]][travisci-url]

[travisci-badge-url]: https://img.shields.io/travis/bouzuya/kraken.svg
[travisci-url]: https://travis-ci.org/bouzuya/kraken

[bouzuya/blog.bouzuya.net]: https://github.com/bouzuya/blog.bouzuya.net

## License

[MIT](LICENSE)

## Author

[bouzuya][user] &lt;[m@bouzuya.net][email]&gt; ([http://bouzuya.net][url])

[user]: https://github.com/bouzuya
[email]: mailto:m@bouzuya.net
[url]: http://bouzuya.net
