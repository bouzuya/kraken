export declare type Entry = {
    date: string;
    html: string;
    pubdate: string;
    title: string;
};
declare const formatAtom: (entries: {
    date: string;
    html: string;
    pubdate: string;
    title: string;
}[]) => string;
export { formatAtom };
