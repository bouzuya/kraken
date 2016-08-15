import { SitemapBuilder } from './sitemap-builder';
import { SitemapFormatter } from './sitemap-formatter';

export type Post = {
  date: string;
  pubdate: string;
};

const formatSitemap = (entries: Post[]): string => {
  const atom = new SitemapBuilder(entries).build();
  const formatted = new SitemapFormatter(atom).format();
  return formatted;
};

export { formatSitemap };
