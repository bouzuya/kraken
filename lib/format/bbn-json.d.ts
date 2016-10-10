import { Entry } from '../types';
declare const formatAllJson: (entries: Entry[]) => string;
declare const formatDailyJson: (entry: Entry) => string;
declare const formatMonthlyJson: (entries: Entry[]) => string;
declare const formatYearlyJson: (entries: Entry[]) => string;
export { formatAllJson, formatDailyJson, formatMonthlyJson, formatYearlyJson };
