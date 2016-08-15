export declare type Markdown = string;
export declare type DateTimeString = string;
export declare type HtmlString = string;
export declare type Minutes = number;
export declare type TagName = string;
export declare type Title = string;
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
export declare type DateString = string;
export interface EntryJson {
    data: Markdown;
    date: DateString;
    html: HtmlString;
    minutes: Minutes;
    pubdate: DateTimeString;
    tags: TagName[];
    title: Title;
}
