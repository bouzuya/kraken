import { Entry, EntryId } from './types';
export declare class Repository {
    private _dir;
    private _ids;
    private _parse;
    constructor(dir: string, listEntryIds: (dirOrFile: string) => EntryId[], parse: (entryDir: string, entryId: EntryId) => Entry);
    each(f: (item: Entry) => any): void;
    findAll(): Entry[];
    findBy(query: {
        year?: string;
        month?: string;
    }): Entry[];
    getMonths(year: string): string[];
    getYears(): string[];
}
