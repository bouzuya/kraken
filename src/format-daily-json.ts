import { Entry, EntryJson } from './types';
import { formatJson } from './fs';

const format = (entry: Entry): EntryJson => {
  const {
    data,
    date,
    html,
    minutes,
    pubdate,
    tags,
    title
  } = entry;
  return {
    data,
    date,
    minutes,
    html,
    pubdate,
    tags,
    title
  };
};

const formatDailyJson = (entry: Entry): string => {
  const entryJson = format(entry);
  return formatJson(entryJson);
};

export { formatDailyJson };
