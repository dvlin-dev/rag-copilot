import { readFileSync } from 'fs';
import { resolve } from 'path';

export const httpsOptions = {
  key: readFileSync(
    resolve(
      __dirname,
      '..',
      '..',
      '..',
      'docs-copilot.devlink.wiki_nginx/docs-copilot.devlink.wiki.key'
    )
  ),
  cert: readFileSync(
    resolve(
      __dirname,
      '..',
      '..',
      '..',
      'docs-copilot.devlink.wiki_nginx/docs-copilot.devlink.wiki.crt'
    )
  ),
};
