var SitemapBuilder;

SitemapBuilder = (function() {
  function SitemapBuilder(posts) {
    this.posts = posts;
  }

  SitemapBuilder.prototype.build = function() {
    return this.posts.map(function(post) {
      return {
        loc: 'http://blog.bouzuya.net/' + post.date.replace(/-/g, '/') + '/',
        lastmod: post.pubdate
      };
    });
  };

  return SitemapBuilder;

})();

export { SitemapBuilder };
