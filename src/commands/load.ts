import { Entry } from '../types';
import { Repository } from '../repository';

const load = (inDir: string): Entry[] => {
  return new Repository(inDir).findAll();
};

export { load };
