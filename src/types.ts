export type Markdown = string; // 'aiueo'
export type DateTimeString = string; // 'yyyy-mm-ddThh:mm:ssZ' or '...+09:00'
export type HtmlString = string; // '<p>aiueo</p>'
export type Minutes = number; // 15
export type TagName = string; // 'programming'
export type Title = string; // 'Hello, world!'

export interface RawEntry {
  meta: any;
  data: Markdown;
}

export interface Entry {
  id: EntryId;
  data: Markdown;
  date: DateString;
  html: HtmlString;
  minutes: Minutes;
  pubdate: DateTimeString;
  tags: TagName[];
  title: Title;
}

export interface EntryId {
  year: string;
  month: string;
  date: string;
  title: string | undefined;
}

export type DateString = string; // 'yyyy-mm-dd'
export interface EntryJson {
  data: Markdown;
  date: DateString;
  html: HtmlString;
  minutes: Minutes;
  pubdate: DateTimeString;
  tags: TagName[];
  title: Title;
}
