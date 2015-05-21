module.exports = class SitemapFormatter
  constructor: (@sitemap) ->

  format: ->
    """
      <?xml version="1.0" encoding="utf-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      #{@sitemap.map(@_buildUrl.bind(@)).join('\n')}
      </urlset>
    """

  _buildUrl: (url) ->
    """
      <url>
        <loc>#{url.loc}</loc>
        <lastmod>#{url.lastmod}</lastmod>
      </url>
    """
