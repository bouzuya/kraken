import { Entry } from '../types';
import {
  listEntryIds as listBbn,
  parseEntry as parseBbn
} from '../parse/bbn';

import { Repository } from '../repository';

const load = (inDir: string): Entry[] => {
  return new Repository(inDir, listBbn, parseBbn).findAll();
};

export { load };
