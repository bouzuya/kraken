import { Entry, EntryId, RawEntry } from '../types';
declare const parseEntry: (entryDir: string, entryId: EntryId, parseRaw: (entryDir: string, entryId: EntryId) => RawEntry) => Entry;
declare const listEntryIds: (dirOrFile: string) => EntryId[];
export { listEntryIds, parseEntry };
