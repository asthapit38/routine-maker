import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// The root index.html is still the source of the app until it is ported to
// components: at build time we serve its <style> and body markup unchanged.
// Its inline <script> is copied to public/legacy.js by scripts/prepare-public.mjs.
const html = readFileSync(join(process.cwd(), 'index.html'), 'utf8');

function part(re: RegExp, name: string): string {
  const m = html.match(re);
  if (!m) throw new Error(`index.html: no ${name} found`);
  return m[1];
}

const body = part(/<body>([\s\S]*)<\/body>/, '<body>');

export const legacyStyle = part(/<style>([\s\S]*?)<\/style>/, '<style>');
export const legacyMarkup = body.slice(0, body.indexOf('<script>'));

// The query changes with the script, so a new deploy never gets a stale copy.
const script = readFileSync(join(process.cwd(), 'public', 'legacy.js'));
export const legacyScriptSrc = `/legacy.js?v=${createHash('sha256').update(script).digest('hex').slice(0, 12)}`;
