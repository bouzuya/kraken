import { Kraken } from './kraken';

export default function () {
  return new Kraken().run().catch((error) => {
    return console.error(error);
  });
}
