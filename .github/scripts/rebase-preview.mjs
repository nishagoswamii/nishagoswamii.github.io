// Previews live under /pr-previews/<number>/, but the site's links and images are
// written from the root. Prefix them in the built files, and keep previews out of search.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [dir, base] = process.argv.slice(2);

const rebase = (text) => text
  .replace(/(["'`]|url\()\/(Images\/|blog|projects|resume\.pdf|favicon\.svg|#)/g, `$1${base}$2`)
  .replace(/(href\s*[=:]\s*["'])\/(["'])/g, `$1${base}$2`);

for (const entry of readdirSync(dir, { recursive: true, withFileTypes: true })) {
  if (!/\.(html|js|css)$/.test(entry.name)) continue;
  const file = join(entry.parentPath, entry.name);
  let text = rebase(readFileSync(file, 'utf8'));
  if (entry.name.endsWith('.html')) text = text.replace('<head>', '<head><meta name="robots" content="noindex">');
  writeFileSync(file, text);
}
