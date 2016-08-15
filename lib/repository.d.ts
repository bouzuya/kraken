import { ParserType } from './parse';
import { Entry } from './types';
export declare class Repository {
    private _entries;
    constructor(dir: string, type?: ParserType);
    findAll(): Entry[];
    findBy(query: {
        year?: string;
        month?: string;
    }): Entry[];
    getMonths(year: string): string[];
    getYears(): string[];
}
