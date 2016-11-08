import { Entry, EntryId } from './types';

export class Repository {
  private _entries: Entry[];
  private _dir: string;
  private _ids: EntryId[];
  private _parse: (entryDir: string, entryId: EntryId) => Entry;

  constructor(
    dir: string,
    listEntryIds: (dirOrFile: string) => EntryId[],
    parse: (entryDir: string, entryId: EntryId) => Entry
  ) {
    this._dir = dir;
    this._ids = listEntryIds(dir);
    this._parse = parse;
    this._entries = listEntryIds(dir).map((id) => parse(dir, id));
  }

  each(f: (item: Entry) => any): void {
    this._ids.forEach((id) => f(this._parse(this._dir, id)))
  }

  findAll(): Entry[] {
    return this._entries; // TODO: defensive copy
  }

  findBy(query: { year?: string; month?: string; }): Entry[] {
    return this._entries.filter(({ id: { year, month } }) => {
      const y = typeof query.year === 'undefined' || year === query.year;
      const m = typeof query.month === 'undefined' || month === query.month;
      return y && m;
    });
  }

  getMonths(year: string): string[] {
    return this.findBy({ year }).reduce<string[]>((ms, { id: { month } }) => {
      return ms.some((m) => m === month) ? ms : ms.concat([month]);
    }, []);
  }

  getYears(): string[] {
    return this._entries.reduce<string[]>((ys, { id: { year } }) => {
      return ys.some((y) => y === year) ? ys : ys.concat([year]);
    }, []);
  }
}
