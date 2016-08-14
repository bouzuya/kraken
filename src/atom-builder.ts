import * as moment from 'moment';

var AtomBuilder;

AtomBuilder = (function () {
  function AtomBuilder(posts) {
    this.posts = posts;
  }

  AtomBuilder.prototype.build = function() {
    var atom, entries, ref, ref1;
    entries = this.posts.sort(function(a, b) {
      var ad, bd;
      ad = moment(a.pubdate);
      bd = moment(b.pubdate);
      if (ad.isSame(bd)) {
        return 0;
      } else if (ad.isBefore(bd)) {
        return 1;
      } else {
        return -1;
      }
    }).filter(function(_, index) {
      return index < 20;
    }).map(function(post) {
      var url;
      url = 'http://blog.bouzuya.net/' + post.date.replace(/-/g, '/') + '/';
      return {
        title: post.title,
        linkHref: url,
        updated: post.pubdate,
        id: url,
        content: post.html
      };
    });
    return atom = {
      title: 'blog.bouzuya.net',
      linkHref: 'http://blog.bouzuya.net/',
      updated: (ref = (ref1 = entries[0]) != null ? ref1.updated : void 0) != null ? ref : '',
      id: 'http://blog.bouzuya.net/',
      author: {
        name: 'bouzuya'
      },
      entries: entries
    };
  };

  return AtomBuilder;

})();

export { AtomBuilder };
