var SitemapBuilder;module.exports=SitemapBuilder=function(){function t(t){this.posts=t}return t.prototype.build=function(){return this.posts.map(function(t){return{loc:"http://blog.bouzuya.net/"+t.date.replace(/-/g,"/")+"/",lastmod:t.pubdate}})},t}();