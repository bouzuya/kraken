export declare type CompiledEntry = {
    data: string;
    date: string;
    minutes: number;
    pubdate: string;
    tags: string;
    title: string;
    html: string;
};
declare const compile: (inDir: string, outDir: string) => Promise<void>;
declare const compileOld: (inDir: string, outDir: string) => Promise<void>;
declare const compileNew: (inDir: string, outDir: string) => Promise<void>;
declare const build: (inDir: string, outDir: string) => Promise<void>;
export { compileOld, compileNew, compile, build };
