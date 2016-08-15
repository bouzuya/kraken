import { Entry, EntryId } from './types';
export declare type ParserType = 'jekyll' | 'default';
declare const parseEntry: (parserType: "jekyll" | "default", entryDir: string, entryId: EntryId) => Entry;
declare const listEntryIds: (dirOrFile: string) => EntryId[];
export { listEntryIds, parseEntry };
