export type Entry = {
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
  constructor(private entries: Entry[]) {}

  build(): Atom {
    const entries = this._buildAtomEntries();
    const updated = typeof entries[0] === "undefined" ? "" : entries[0].updated;
    const atom = {
      title: "blog.bouzuya.net",
      linkHref: "https://blog.bouzuya.net/",
      updated,
      id: "https://blog.bouzuya.net/",
      author: { name: "bouzuya" },
      entries,
    };
    return atom;
  }

  _buildAtomEntries(): AtomEntry[] {
    return this.entries
      .sort(({ pubdate: a }, { pubdate: b }) => {
        // order by pubdate desc.
        return a === b ? 0 : a < b ? 1 : -1;
      })
      .filter((_, index) => index < 20) // limit
      .map((entry) => {
        const url = `https://blog.bouzuya.net/${entry.date.replace(
          /-/g,
          "/"
        )}/`;
        const atomEntry = {
          title: entry.title,
          linkHref: url,
          updated: entry.pubdate,
          id: url,
          content: entry.html,
        };
        return atomEntry;
      });
  }
}

class AtomFormatter {
  constructor(private atom: Atom) {}

  format(): string {
    const atom = this.atom;
    return [
      '<?xml version="1.0" encoding="utf-8" ?>',
      '<feed xmlns="http://www.w3.org/2005/Atom">',
      `<title>${this._escapeHtml(atom.title)}</title>`,
      `<link rel="alternate" type="text/html" href="${atom.linkHref}" />`,
      `<updated>${atom.updated}</updated>`,
      `<id>${atom.id}</id>`,
      `<author><name>${atom.author.name}</name></author>`,
      atom.entries.map(this._buildEntry.bind(this)).join("\n"),
      "</feed>",
    ].join("");
  }

  _buildEntry(entry: AtomEntry): string {
    return [
      "<entry>",
      `<title>${this._escapeHtml(entry.title)}</title>`,
      `<link href="${entry.linkHref}" />`,
      `<updated>${entry.updated}</updated>`,
      `<id>${entry.id}</id>`,
      `<content type="html">${this._escapeHtml(entry.content)}</content>`,
      "</entry>",
    ].join("");
  }

  _escapeHtml(html: string): string {
    return html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }
}

const formatAtom = (entries: Entry[]): string => {
  const atom = new AtomBuilder(entries).build();
  const formatted = new AtomFormatter(atom).format();
  return formatted;
};

export { formatAtom };
