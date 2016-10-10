# kraken documents

## Data (Input)

- bbn parser
- jekyll parser

### bbn parser

```
/{yyyy}/{mm}/{yyyy-mm-dd}.json       ... meta json
/{yyyy}/{mm}/{yyyy-mm-dd}.md         ... markdown
```

#### meta json

```
{
  minutes: number;
  pubdate: DateTimeString; // 'yyyy-mm-ddThh:mm:ssZ'
  tags?: string[];
  title: string;
}
```

#### markdown

It will be parsed by [chjj/marked][].

[chjj/marked]: https://github.com/chjj/marked

### Jekyll Parser

TODO

## API (Output)

```
/{yyyy}.json                         ... yearly json
/{yyyy}/index.json                   ... yearly json
/{yyyy}/{mm}.json                    ... monthly json
/{yyyy}/{mm}/index.json              ... monthly json
/{yyyy}/{mm}/{dd}.json               ... daily json
/{yyyy}/{mm}/{dd}/index.json         ... daily json
/{yyyy}/{mm}/{dd}/{title}.json       ... daily json
/{yyyy}/{mm}/{dd}/{title}/index.json ... daily json
/posts.json                          ... all json
/tags.json                           ... tags json
/atom.xml                            ... atom xml
/sitemap.xml                         ... sitemap xml
/linked.json                         ... linked json
/tokens.json                         ... tokens json
```

### daily json

```
type DailyJson = {
  data: Markdown; // 'markdown'
  date: DateString; // 'yyyy-mm-dd' in '+09:00'
  minutes: number;
  html: HtmlString; // '<p>markdown</p>'
  pubdate: DateTimeString; // 'yyyy-mm-ddThh:mm:ssZ'
  tags: string[];
  title: string;
};
```

### monthly json

```
type MonthlyJson = {
  data: Markdown; // 'markdown'
  date: DateString; // 'yyyy-mm-dd' in '+09:00'
  minutes: number;
  html: HtmlString; // '<p>markdown</p>'
  pubdate: DateTimeString; // 'yyyy-mm-ddThh:mm:ssZ'
  tags: string[];
  title: string;
}[];
```

### yearly json

```
type YearlyJson = {
  data: Markdown; // 'markdown'
  date: DateString; // 'yyyy-mm-dd' in '+09:00'
  minutes: number;
  html: HtmlString; // '<p>markdown</p>'
  pubdate: DateTimeString; // 'yyyy-mm-ddThh:mm:ssZ'
  tags: string[];
  title: string;
}[];
```

### all json

```
type AllJson = {
  date: DateString; // 'yyyy-mm-dd'
  minutes: number;
  pubdate: DateTimeString; // 'yyyy-mm-ddThh:mm:ssZ'
  tags: string[];
  title: string;
}[];
```

### tags json

```
type TagsJson = {
  name: string;
  count: number;
}[];
```

### atom xml

TODO

### sitemap xml

TODO

### linked json

```
type LinkedJson = {
  [to: EntryKey]: EntryKey[]; // ['yyyy-mm-dd', ...]
};
```

### tokens json

TODO
