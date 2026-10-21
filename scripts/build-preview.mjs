#!/usr/bin/env node
/**
 * Builds a shareable web preview of the app into `preview/` (git-ignored).
 *
 * `expo export --platform web` emits absolute URLs (/_expo/…, /assets/…) and Expo Router reads
 * `location.pathname`. A preview host serves the files under an unknown sub-path, so this script:
 *  1. rewrites absolute asset/chunk URLs to relative ones,
 *  2. pins a <base> to the page's own folder and resets the path to "/" before the bundle boots,
 *  3. renames `_expo/`, `_`-prefixed and `[param]` chunks (names the preview host rejects),
 *  4. shows the app full screen on phones and inside an iPhone-sized frame on desktop.
 *
 * Usage: node scripts/build-preview.mjs
 */
import { execSync } from 'node:child_process';
import { readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const out = join(root, 'preview');

rmSync(out, { recursive: true, force: true });
execSync(`npx expo export --platform web --output-dir ${out}`, {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, CI: '1', EXPO_OFFLINE: '1' },
});

const BUNDLE_DIR = 'bundle';
const jsDir = join(out, '_expo', 'static', 'js', 'web');
// The host reserves names starting with "_" and dislikes brackets: "__common-<hash>.js" becomes
// "c__common-<hash>.js" and "[id]-<hash>.js" becomes "p-id-<hash>.js".
const safeName = (n) => (n.startsWith('_') ? `c${n}` : n.replace(/^\[(\.\.\.)?([^\]]+)\]/, 'p-$2'));
const renamedChunks = readdirSync(jsDir).filter((n) => safeName(n) !== n);
const relativize = (s) => {
  let r = s.replaceAll('"/_expo/', `"${BUNDLE_DIR}/`).replaceAll('"/assets/', '"assets/');
  for (const n of renamedChunks) r = r.replaceAll(`/${n}`, `/${safeName(n)}`);
  return r;
};

// Lazy route chunks are resolved against the dev-server origin; resolve them against <base> instead.
const CHUNK_URL = 'const{url:t}=(0,u.default)();return t?new URL(e,t).toString()';
const CHUNK_URL_PATCHED = 'const t=document.baseURI;return t?new URL(e,t).toString()';
let chunkUrlPatched = false;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.js')) {
      let js = relativize(readFileSync(p, 'utf8'));
      if (js.includes(CHUNK_URL)) {
        js = js.replace(CHUNK_URL, CHUNK_URL_PATCHED);
        chunkUrlPatched = true;
      }
      writeFileSync(p, js);
    }
  }
}
walk(join(out, '_expo'));
if (!chunkUrlPatched) throw new Error('Chunk URL resolver not found: the Expo runtime changed, update CHUNK_URL.');
for (const n of renamedChunks) renameSync(join(jsDir, n), join(jsDir, safeName(n)));
renameSync(join(out, '_expo'), join(out, BUNDLE_DIR));

const html = readFileSync(join(out, 'index.html'), 'utf8');
const scripts = [...relativize(html).matchAll(/<script src="\/?(bundle\/[^"]+)" defer><\/script>/g)].map((m) => m[1]);
if (scripts.length === 0) throw new Error('No bundle scripts found in index.html');

// The preview host wraps the page in its own document skeleton, so emit body content only.
const page = `<title>Own App Preview</title>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>
  /* Phones: the app fills the screen. Desktop: an iPhone 15-sized frame (390 × 844 pt), scaled to fit. */
  :root { --bg: #E9E7E4; --app: #FFFFFF; --bezel: #161515; color-scheme: light; }
  html, body { height: 100%; }
  body { margin: 0; overflow: hidden; background: var(--bg); }
  .phone { position: relative; height: 100%; background: var(--app); }
  #root { display: flex; height: 100%; }
  .island { display: none; }
  .phone-frame body { display: flex; align-items: center; justify-content: center; }
  .phone-frame .phone {
    flex: none; width: 390px; height: 844px; border-radius: 55px; overflow: hidden;
    box-shadow: 0 0 0 12px var(--bezel), 0 0 0 13px #3a3836, 0 30px 80px rgba(17,17,17,0.25);
    transform-origin: center; transform: scale(var(--scale, 1));
  }
  .phone-frame .island {
    display: block; position: absolute; z-index: 10; top: 11px; left: 50%; width: 124px; height: 36px;
    margin-left: -62px; border-radius: 20px; background: var(--bezel); pointer-events: none;
  }
</style>
<script>
  (function () {
    var base = document.createElement('base');
    base.href = new URL('./', location.href).href;
    document.head.appendChild(base);
    try { history.replaceState(null, '', '/'); } catch (e) {}
    // Wide screens get the device frame; the app reads this flag to simulate iPhone safe areas.
    var framed = window.matchMedia('(min-width: 600px)').matches;
    window.__OWN_PREVIEW_FRAME__ = framed;
    if (framed) {
      document.documentElement.classList.add('phone-frame');
      var fit = function () {
        var scale = Math.min(1, (window.innerHeight - 48) / 870, (window.innerWidth - 48) / 416);
        document.documentElement.style.setProperty('--scale', String(Math.max(0.5, scale)));
      };
      fit();
      window.addEventListener('resize', fit);
    }
  })();
</script>
<noscript>This preview needs JavaScript.</noscript>
<div class="phone"><div class="island"></div><div id="root"></div></div>
${scripts.map((s) => `<script src="${s}" defer></script>`).join('\n')}
`;
writeFileSync(join(out, 'index.html'), page);
rmSync(join(out, 'favicon.ico'), { force: true });
rmSync(join(out, 'metadata.json'), { force: true });
// Files to publish next to index.html (italic faces and router dev assets are never used).
const files = [];
(function list(dir, rel) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const r = rel ? `${rel}/${name}` : name;
    if (statSync(p).isDirectory()) list(p, r);
    else if (r !== 'index.html' && !r.includes('Italic') && !r.startsWith('assets/node_modules/expo-router/')) files.push({ path: r });
  }
})(out, '');
writeFileSync(join(root, 'preview-files.json'), JSON.stringify(files.sort((a, b) => a.path.localeCompare(b.path))));
console.log(`Preview ready in ${out} (${files.length} files listed in preview-files.json)`);
