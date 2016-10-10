![kraken](https://cloud.githubusercontent.com/assets/1221346/17460910/189fabd0-5cb4-11e6-83b6-bc8122c7557a.png)

kraken: A blog data generator for [blog.bouzuya.net](http://blog.bouzuya.net/).

See: [bouzuya/blog.bouzuya.net][]

## Installation

```
$ npm install bouzuya/kraken
```

Or

```
$ npm install https://github.com/bouzuya/kraken/archive/<VERSION>.tar.gz
```

## Usage

```
$ kraken build private/ public/  # private/ (md) -> public/ (json & xml)
$ kraken start public/           # run server
```

### `kraken build`

```
$ # before
$ cat data/2014/01/2014-01-01.md
i love munchkin.

$ cat data/2014/01/2014-01-01.json
{
  "minutes": 20,
  "pubdate": "2014-01-01T23:59:59+09:00",
  "tags": [
    "misc"
  ],
  "title": "She has very short legs"
}

$ # pre-render
$ kraken build data dist

$ # after
$ cat dist/2014/01/01.json
{"data":"i love munchikin.","date":"2014-01-01","minutes":20,"html":"<p>i love munchikin.</p>\n\n","pubdate":"2014-01-01T23:59:59+09:00","tags": ["misc"],"title": "She has very short legs"}

$ # create same files in some paths
$ diff dist/2014/01/01.json dist/2014/01/01/index.json
$ diff dist/2014/01/01.json dist/2014/01/01/diary.json
$ diff dist/2014/01/01.json dist/2014/01/01/diary/index.json
```

### `kraken start`

```
$ cat dist/2014/01/01.json
{"data":"i love munchikin.","date":"2014-01-01","minutes":20,"html":"<p>i love munchikin.</p>\n\n","pubdate":"2014-01-01T23:59:59+09:00","tags": ["misc"],"title": "She has very short legs"}

$ kraken start dist/

$ curl http://localhost/2014/01/01.json
{"data":"i love munchikin.","date":"2014-01-01","minutes":20,"html":"<p>i love munchikin.</p>\n\n","pubdate":"2014-01-01T23:59:59+09:00","tags": ["misc"],"title": "She has very short legs"}
```

## Document

See [doc/](doc)

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
