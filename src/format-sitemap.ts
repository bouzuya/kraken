export type Post = {
  date: string;
  pubdate: string;
};

class SitemapBuilder {
  private posts: Post[];

  constructor(posts: Post[]) {
    this.posts = posts;
  }

  build() {
    return this.posts.map((post) => {
      return {
        loc: 'http://blog.bouzuya.net/' + post.date.replace(/-/g, '/') + '/',
        lastmod: post.pubdate
      };
    });
  }
}

type SitemapUrl = {
  loc: string;
  lastmod: string;
};

type Sitemap = SitemapUrl[];

class SitemapFormatter {
  private sitemap: Sitemap;

  constructor(sitemap: Sitemap) {
    this.sitemap = sitemap;
  }

  format(): string {
    return "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n" + (this.sitemap.map(this._buildUrl.bind(this)).join('\n')) + "\n</urlset>";
  }

  _buildUrl(url: SitemapUrl): string {
    return "<url>\n  <loc>" + url.loc + "</loc>\n  <lastmod>" + url.lastmod + "</lastmod>\n</url>";
  }
}

const formatSitemap = (entries: Post[]): string => {
  const atom = new SitemapBuilder(entries).build();
  const formatted = new SitemapFormatter(atom).format();
  return formatted;
};

export { formatSitemap };
