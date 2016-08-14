import { Kraken } from './kraken';

export default function () {
  return new Kraken().run()["catch"](function(e) {
    return console.error(e);
  });
};
