import * as path from 'path';
import { process } from './globals';

export class Config {
  private _dstDir: string;
  private _rootDir: string;
  private _postsDir: string;

  load(): void {
    this._rootDir = process.cwd();
    this._postsDir = path.join(this._rootDir, 'data');
    this._dstDir = path.join(this._rootDir, 'dist');
  }

  rootDir(): string {
    return this._rootDir;
  }

  postsDir(): string {
    return this._postsDir;
  }

  dstDir(): string {
    return this._dstDir;
  }
}
