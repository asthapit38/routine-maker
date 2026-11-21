// Fills public/ (gitignored) before `next dev` / `next build` from the files at
// the repo root, which stay the source: the manifest and icons, served at the
// same paths, and the inline <script> of index.html as public/legacy.js, byte
// for byte (Next.js rewrites a literal "</body></html>" in inline scripts).
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/);
if (!script) throw new Error('index.html: no inline <script> found');

rmSync('public', { recursive: true, force: true });
mkdirSync('public');
cpSync('manifest.webmanifest', 'public/manifest.webmanifest');
cpSync('icons', 'public/icons', { recursive: true });
writeFileSync('public/legacy.js', script[1]);
