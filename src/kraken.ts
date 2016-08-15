import { Config } from './config';
import { compile } from './compile';

export class Kraken {
  private _config: Config;

  constructor() {
    this._config = new Config();
    this._config.load();
  }

  run(): void {
    const postsDir = this._config.postsDir();
    const dstDir = this._config.dstDir();
    compile(postsDir, dstDir);
  }
}
