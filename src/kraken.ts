import { Config } from './config';
import { Compiler } from './compiler';
import { Promise } from './globals';

export class Kraken {
  private _config: Config;
  private _compiler: Compiler;

  constructor() {
    this._config = new Config();
    this._config.load();
    const postsDir = this._config.postsDir();
    const dstDir = this._config.dstDir();
    this._compiler = new Compiler({
      postsDir: postsDir,
      dstDir: dstDir
    });
  }

  run(): Promise<void> {
    return this._compiler.compile();
  }
}
