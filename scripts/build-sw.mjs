// Writes out/sw.js from the root sw.js template after `next build`.
// The precache list is every file the exported app needs to open offline, and
// the cache name carries a hash of those files, so any change to them makes a
// new worker that clients get through the "new version" prompt.
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const OUT = 'out';

const files = dir => readdirSync(dir, { withFileTypes: true }).flatMap(d =>
  d.isDirectory() ? files(join(dir, d.name)) : [join(dir, d.name)]);
const url = f => '/' + relative(OUT, f).split(sep).join('/');

// Every same-origin file out/index.html loads is precached as written there:
// the legacy script only as /legacy.js?v=<hash>, never as a possibly stale /legacy.js.
const html = readFileSync(join(OUT, 'index.html'), 'utf8');
const refs = [...html.matchAll(/(?:src|href)="(\/[^"#]*)"/g)].map(m => m[1]);

const precached = [
  join(OUT, 'index.html'),
  join(OUT, 'manifest.webmanifest'),
  ...files(join(OUT, 'icons')),
  ...files(join(OUT, '_next', 'static')),
].sort();
const shell = [...new Set(['/', ...precached.map(url), ...refs])];

// Fail the build if the page loads a file that is not in out/.
for (const ref of refs) {
  if (!existsSync(join(OUT, ref.split('?')[0]))) throw new Error(`out/index.html loads ${ref}, which is not in out/`);
}

const hash = createHash('sha256');
for (const f of precached) hash.update(url(f)).update('\0').update(readFileSync(f)).update('\0');
const cache = `roster-v14-${hash.digest('hex').slice(0, 12)}`;

let sw = readFileSync('sw.js', 'utf8');
const fill = (re, value) => {
  if (!re.test(sw)) throw new Error(`sw.js: ${re} not found`);
  sw = sw.replace(re, value);
};
fill(/^const CACHE = .*;$/m, `const CACHE = ${JSON.stringify(cache)};`);
fill(/^const SHELL = \[[\s\S]*?\];$/m, `const SHELL = ${JSON.stringify(shell, null, 2)};`);
writeFileSync(join(OUT, 'sw.js'), sw);
console.log(`out/sw.js: ${cache}, ${shell.length} files precached`);
