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

const formatAllJson = (entries: Entry[]): string => {
  return formatJson(entries.map((entry) => {
    const { date, minutes, pubdate, tags, title } = entry;
    return { date, minutes, pubdate, tags, title };
  }));
};

const formatDailyJson = (entry: Entry): string => {
  const entryJson = format(entry);
  return formatJson(entryJson);
};

const formatMonthlyJson = (entries: Entry[]): string => {
  return formatJson(entries.map(format));
};

const formatYearlyJson = (entries: Entry[]): string => {
  return formatJson(entries.map(format));
};

export { formatAllJson, formatDailyJson, formatMonthlyJson, formatYearlyJson };
