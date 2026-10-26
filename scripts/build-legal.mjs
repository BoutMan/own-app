// Builds the hosted Terms of Use and Privacy Policy (legal/*.html) from src/content/legal.ts, the
// same text as in the app. Host them on the Own website and paste the URLs in App Store Connect.
// Self-contained on purpose: no web font or third-party request, like the app. Run: npm run legal
import { mkdirSync, writeFileSync } from 'node:fs';

const { legalDocs } = await import('../src/content/legal.ts');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function page(doc) {
  const title = esc(doc.title).replace(esc(doc.accent), `<span class="k">${esc(doc.accent)}</span>`);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Own · ${esc(doc.title)}</title>
<style>
  body { margin: 0; background: #fff; color: #111; font-family: 'Instrument Sans', system-ui, sans-serif; }
  main { max-width: 680px; margin: 0 auto; padding: 48px 20px 80px; }
  .logo { font-weight: 700; font-size: 22px; letter-spacing: -0.04em; margin-bottom: 40px; }
  h1 { font-size: 40px; letter-spacing: -0.05em; line-height: 1.05; margin: 0 0 16px; }
  h2 { font-size: 20px; letter-spacing: -0.03em; margin: 32px 0 8px; }
  .k { color: #8A6E5A; }
  p { line-height: 1.6; color: #444; margin: 0 0 12px; }
  .intro { color: #111; font-size: 17px; }
</style>
</head>
<body>
<main>
  <div class="logo">own.</div>
  <h1>${title}</h1>
  <p class="intro">${esc(doc.intro)}</p>
${doc.sections.map((s) => `  <h2>${esc(s.heading)}</h2>\n${s.paragraphs.map((p) => `  <p>${esc(p)}</p>`).join('\n')}`).join('\n')}
</main>
</body>
</html>
`;
}

mkdirSync('legal', { recursive: true });
for (const doc of Object.values(legalDocs)) writeFileSync(`legal/${doc.id}.html`, page(doc));
console.log('Wrote legal/terms.html and legal/privacy.html');
