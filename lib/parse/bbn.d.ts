import { listEntryIds } from './base';
import { Entry, EntryId } from '../types';
declare const parseEntry: (entryDir: string, entryId: EntryId) => Entry;
export { listEntryIds, parseEntry };
