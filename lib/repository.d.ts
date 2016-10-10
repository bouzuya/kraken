import { Entry, EntryId } from './types';
export declare class Repository {
    private _entries;
    constructor(dir: string, listEntryIds: (dirOrFile: string) => EntryId[], parse: (entryDir: string, entryId: EntryId) => Entry);
    findAll(): Entry[];
    findBy(query: {
        year?: string;
        month?: string;
    }): Entry[];
    getMonths(year: string): string[];
    getYears(): string[];
}
