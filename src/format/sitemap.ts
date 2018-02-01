export type Entry = {
  date: string;
  pubdate: string;
};

type SitemapUrl = {
  loc: string;
  lastmod: string;
};
type Sitemap = SitemapUrl[];

class SitemapBuilder {
  constructor(private entries: Entry[]) { }

  build(): Sitemap {
    return this.entries.map(({ date, pubdate: lastmod }) => {
      const loc = `https://blog.bouzuya.net/${date.replace(/-/g, '/')}/`;
      return { loc, lastmod };
    });
  }
}

class SitemapFormatter {
  constructor(private sitemap: Sitemap) { }

  format(): string {
    return [
      '<?xml version="1.0" encoding="utf-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      this.sitemap.map(this._buildUrl.bind(this)).join('\n'),
      '</urlset>'
    ].join('');
  }

  private _buildUrl(url: SitemapUrl): string {
    return [
      '<url>',
      `<loc>${url.loc}</loc>`,
      `<lastmod>${url.lastmod}</lastmod>`,
      '</url>'
    ].join('');
  }
}

const formatSitemap = (entries: Entry[]): string => {
  const atom = new SitemapBuilder(entries).build();
  const formatted = new SitemapFormatter(atom).format();
  return formatted;
};

export { formatSitemap };
