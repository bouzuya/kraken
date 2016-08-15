import * as moment from 'moment';

export type Post = {
  date: string;
  html: string;
  pubdate: string;
  title: string;
};

export type AtomEntry = {
  title: string;
  linkHref: string;
  updated: string;
  id: string;
  content: string;
};

export type Atom = {
  title: string;
  linkHref: string;
  updated: string;
  id: string;
  author: {
    name: string;
  };
  entries: AtomEntry[];
};

export class AtomBuilder {
  constructor(private posts: Post[]) {
    this.posts = posts;
  }

  build(): Atom {
    const entries: AtomEntry[] = this.posts.sort(function (a, b) {
      const ad = moment(a.pubdate);
      const bd = moment(b.pubdate);
      if (ad.isSame(bd)) {
        return 0;
      } else if (ad.isBefore(bd)) {
        return 1;
      } else {
        return -1;
      }
    }).filter(function (_, index) {
      return index < 20;
    }).map(function (post) {
      const url = `http://blog.bouzuya.net/${post.date.replace(/-/g, '/')}/`;
      return {
        title: post.title,
        linkHref: url,
        updated: post.pubdate,
        id: url,
        content: post.html
      };
    });
    const lastEntry: AtomEntry | undefined = entries[0];
    const updated = typeof lastEntry === 'undefined' ? '' : lastEntry.updated;
    return {
      title: 'blog.bouzuya.net',
      linkHref: 'http://blog.bouzuya.net/',
      updated,
      id: 'http://blog.bouzuya.net/',
      author: {
        name: 'bouzuya'
      },
      entries: entries
    };
  }
}
