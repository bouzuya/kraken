export type Post = {
  date: string;
  pubdate: string;
};

export class SitemapBuilder {
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
