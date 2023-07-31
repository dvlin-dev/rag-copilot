import { createHash } from 'crypto';

export function ensureArray(input: string | string[]): string[] {
  return Array.isArray(input) ? input : [input];
}

export function generateHash(input) {
  const hash = createHash('sha256');
  hash.update(input);
  return hash.digest('hex');
}
