import { readFileSync } from 'fs';
import { resolve } from 'path';

export const httpsOptions = {
  key: readFileSync(
    resolve(__dirname, '..', '..', '..', 'devlink.wiki_nginx/devlink.wiki.key')
  ),
  cert: readFileSync(
    resolve(
      __dirname,
      '..',
      '..',
      '..',
      'devlink.wiki_nginx/devlink.wiki_bundle.crt'
    )
  ),
};
