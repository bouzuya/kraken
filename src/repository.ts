import { listEntryIds, parseEntry, ParserType } from './parse';
import { Entry } from './types';

export class Repository {
  private _entries: Entry[];

  constructor(dir: string, type: ParserType = 'default') {
    this._entries = listEntryIds(dir).map((id) => parseEntry(type, dir, id));
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
