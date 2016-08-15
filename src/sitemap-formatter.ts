export type SitemapUrl = {
  loc: string;
  lastmod: string;
};
export type Sitemap = SitemapUrl[];

export class SitemapFormatter {
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
