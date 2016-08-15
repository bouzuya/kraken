import { AtomBuilder } from './atom-builder';
import { AtomFormatter } from './atom-formatter';

export type Post = {
  date: string;
  html: string;
  pubdate: string;
  title: string;
};

const formatAtom = (entries: Post[]): string => {
  const atom = new AtomBuilder(entries).build();
  const formatted = new AtomFormatter(atom).format();
  return formatted;
};

export { formatAtom };
