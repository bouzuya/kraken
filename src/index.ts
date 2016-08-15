import { Kraken } from './kraken';
import { console } from './globals';

export default function (): Promise<void> {
  return new Kraken().run().catch((error) => {
    return console.error(error);
  });
}
