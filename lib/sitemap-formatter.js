var SitemapFormatter;module.exports=SitemapFormatter=function(){function t(t){this.sitemap=t}return t.prototype.format=function(){return'<?xml version="1.0" encoding="utf-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+this.sitemap.map(this._buildUrl.bind(this)).join("\n")+"\n</urlset>"},t.prototype._buildUrl=function(t){return"<url>\n  <loc>"+t.loc+"</loc>\n  <lastmod>"+t.lastmod+"</lastmod>\n</url>"},t}();