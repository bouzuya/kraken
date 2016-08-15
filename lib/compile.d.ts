export declare type CompiledEntry = {
    data: string;
    date: string;
    minutes: number;
    pubdate: string;
    tags: string;
    title: string;
    html: string;
};
declare const compile: (inDir: string, outDir: string) => void;
declare const compileOld: (inDir: string, outDir: string) => void;
declare const compileNew: (inDir: string, outDir: string) => void;
export { compileOld, compileNew, compile };
