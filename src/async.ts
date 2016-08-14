import { Promise } from './globals';

const eachSeries = <T>(arr: T[], f: (item: T) => void): Promise<void> => {
  return arr.reduce((promise, item) => {
    return promise.then(() => void f(item));
  }, Promise.resolve());
};

export { eachSeries };
