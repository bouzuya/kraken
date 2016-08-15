import * as fs from 'fs';
import * as fse from 'fs-extra';
import { join } from 'path';

const formatJson = (data: any, space?: number): string => {
  return JSON.stringify(data, undefined, space);
};

const listFiles = (path: string): string[] => {
  function f(files: string[], p: string): string[] {
    if (!fs.statSync(p).isDirectory()) return files.concat([p]);
    return fs.readdirSync(p).reduce((r, dof) => {
      return f(r, join(p, dof));
    }, files);
  };
  return f([], path);
};

const parseJson = (json: string): any => {
  return JSON.parse(json);
};

const readFile = (path: string): string => {
  return fs.readFileSync(path, { encoding: 'utf-8' });
};

const writeFile = (path: string, data: string): void => {
  (fse.outputFileSync as any)(path, data, { encoding: 'utf-8' });
};

export { formatJson, listFiles, parseJson, join as path, readFile, writeFile };
