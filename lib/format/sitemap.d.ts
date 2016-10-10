export declare type Entry = {
    date: string;
    pubdate: string;
};
declare const formatSitemap: (entries: {
    date: string;
    pubdate: string;
}[]) => string;
export { formatSitemap };
