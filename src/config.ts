import * as path from 'path';
import { process } from './globals';

export class Config {
  private _dstDir: string;
  private _rootDir: string;
  private _postsDir: string;

  load() {
    this._rootDir = process.cwd();
    this._postsDir = path.join(this._rootDir, 'data');
    return this._dstDir = path.join(this._rootDir, 'dist');
  }

  rootDir() {
    return this._rootDir;
  }

  postsDir() {
    return this._postsDir;
  }

  dstDir() {
    return this._dstDir;
  }
}
