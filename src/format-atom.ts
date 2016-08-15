import * as moment from 'moment';

export type Post = {
  date: string;
  html: string;
  pubdate: string;
  title: string;
};

type AtomEntry = {
  title: string;
  linkHref: string;
  updated: string;
  id: string;
  content: string;
};

type Atom = {
  title: string;
  linkHref: string;
  updated: string;
  id: string;
  author: {
    name: string;
  };
  entries: AtomEntry[];
};

class AtomBuilder {
  constructor(private posts: Post[]) {
    this.posts = posts;
  }

  build(): Atom {
    const entries: AtomEntry[] = this.posts
      .sort((a, b) => {
        const ad = moment(a.pubdate);
        const bd = moment(b.pubdate);
        if (ad.isSame(bd)) {
          return 0;
        } else if (ad.isBefore(bd)) {
          return 1;
        } else {
          return -1;
        }
      })
      .filter((_, index) => index < 20)
      .map((post) => {
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

class AtomFormatter {
  constructor(private atom: Atom) {
    this.atom = atom;
  }

  format(): string {
    const atom = this.atom;
    return "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<feed xmlns=\"http://www.w3.org/2005/Atom\">\n  <title>" + (this._escapeHtml(atom.title)) + "</title>\n  <link rel=\"alternate\" type=\"text/html\" href=\"" + atom.linkHref + "\" />\n  <updated>" + atom.updated + "</updated>\n  <id>" + atom.id + "</id>\n  <author>\n    <name>" + atom.author.name + "</name>\n  </author>\n  " + (atom.entries.map(this._buildEntry.bind(this)).join('\n')) + "\n</feed>";
  }

  _buildEntry(entry: AtomEntry): string {
    return "<entry>\n  <title>" + (this._escapeHtml(entry.title)) + "</title>\n  <link href=\"" + entry.linkHref + "\" />\n  <updated>" + entry.updated + "</updated>\n  <id>" + entry.id + "</id>\n  <content type=\"html\">" + (this._escapeHtml(entry.content)) + "</content>\n</entry>";
  }

  _escapeHtml(html: string): string {
    return html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
  }
}

const formatAtom = (entries: Post[]): string => {
  const atom = new AtomBuilder(entries).build();
  const formatted = new AtomFormatter(atom).format();
  return formatted;
};

export { formatAtom };
