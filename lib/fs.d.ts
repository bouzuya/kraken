import { join } from 'path';
declare const formatJson: (data: any, space?: number | undefined) => string;
declare const listFiles: (path: string) => string[];
declare const parseJson: (json: string) => any;
declare const readFile: (path: string) => string;
declare const writeFile: (path: string, data: string) => void;
export { formatJson, listFiles, parseJson, join as path, readFile, writeFile };
