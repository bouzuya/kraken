// Generated by CoffeeScript 1.10.0
var SitemapFormatter;

module.exports = SitemapFormatter = (function() {
  function SitemapFormatter(sitemap) {
    this.sitemap = sitemap;
  }

  SitemapFormatter.prototype.format = function() {
    return "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n" + (this.sitemap.map(this._buildUrl.bind(this)).join('\n')) + "\n</urlset>";
  };

  SitemapFormatter.prototype._buildUrl = function(url) {
    return "<url>\n  <loc>" + url.loc + "</loc>\n  <lastmod>" + url.lastmod + "</lastmod>\n</url>";
  };

  return SitemapFormatter;

})();