import { Entry, EntryId } from './types';

export class Repository {
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
  }

  each(f: (item: Entry) => any): void {
    this._ids.forEach((id) => f(this._parse(this._dir, id)));
  }

  findAll(): Entry[] {
    // TODo: defensive copy
    return this._ids.map((id) => this._parse(this._dir, id));
  }

  findBy(query: { year?: string; month?: string; }): Entry[] {
    return this._ids
      .filter(({ year, month }) => {
        const y = typeof query.year === 'undefined' || year === query.year;
        const m = typeof query.month === 'undefined' || month === query.month;
        return y && m;
      })
      .map((id) => this._parse(this._dir, id));
  }

  getEntryIds(): EntryId[] {
    return this._ids;
  }

  getMonths(year: string): string[] {
    return this.findBy({ year }).reduce<string[]>((ms, { id: { month } }) => {
      return ms.some((m) => m === month) ? ms : ms.concat([month]);
    }, []);
  }

  getYears(): string[] {
    return this._ids.reduce<string[]>((ys, { year }) => {
      return ys.some((y) => y === year) ? ys : ys.concat([year]);
    }, []);
  }

  reduce<T>(f: (a: T, i: Entry) => T, s: T): T {
    return this._ids.reduce((a, id) => f(a, this._parse(this._dir, id)), s);
  }
}
