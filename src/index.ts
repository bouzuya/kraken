import { load } from './load';
import { build, compile, compileOld, compileNew } from './build';
import { start } from './commands/start';

export * from './migrate';
export {
  build,
  compile,
  compileOld,
  compileNew,
  load,
  start
};
