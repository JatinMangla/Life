/**
 * Report Lighthouse results where they can be read without digging through
 * logs: a table in the job summary, one annotation per page with its scores,
 * and one per audit that is costing points in a category below target.
 *
 * Run after `lhci collect` (and `lhci upload`, for report links).
 * Usage: node scripts/lighthouse-summary.cjs
 */
const fs = require('node:fs');
const path = require('node:path');

const DIR = path.join(process.cwd(), '.lighthouseci');
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];
/** Mirrors the error-level assertions in .lighthouserc.json. */
const TARGET = { accessibility: 0.95, 'best-practices': 0.95, seo: 0.95 };

if (!fs.existsSync(DIR)) {
  console.log('::warning title=Lighthouse::No .lighthouseci results to summarise.');
  process.exit(0);
}

const reports = fs
  .readdirSync(DIR)
  .filter(file => /^lhr-.*\.json$/.test(file))
  .map(file => JSON.parse(fs.readFileSync(path.join(DIR, file), 'utf8')));

let links = {};
try {
  links = JSON.parse(fs.readFileSync(path.join(DIR, 'links.json'), 'utf8'));
} catch {
  // No upload ran, or it failed; the scores are still worth reporting.
}

const score = value => (value === null || value === undefined ? '–' : Math.round(value * 100));
const rows = [];

for (const lhr of reports) {
  const url = lhr.finalDisplayedUrl ?? lhr.requestedUrl;
  const page = new URL(url).pathname;

  if (lhr.runtimeError) {
    console.log(`::error title=Lighthouse ${page}::${lhr.runtimeError.code}: ${lhr.runtimeError.message}`);
    continue;
  }

  const scores = CATEGORIES.map(id => `${id} ${score(lhr.categories[id]?.score)}`).join(', ');
  const report = links[lhr.requestedUrl] ?? links[url];

  console.log(`::notice title=Lighthouse ${page}::${scores}${report ? ` — ${report}` : ''}`);
  rows.push(
    `| ${page} | ${CATEGORIES.map(id => score(lhr.categories[id]?.score)).join(' | ')} | ${
      report ? `[report](${report})` : ''
    } |`
  );

  for (const [id, target] of Object.entries(TARGET)) {
    const category = lhr.categories[id];

    if (!category || category.score >= target) continue;

    for (const ref of category.auditRefs.filter(entry => entry.weight > 0)) {
      const audit = lhr.audits[ref.id];

      if (audit.score === null || audit.score >= 1) continue;

      const items = (audit.details?.items ?? [])
        .slice(0, 3)
        .map(item => item.description ?? item.source?.url ?? item.url ?? item.node?.snippet ?? '')
        .filter(Boolean)
        .join(' | ')
        .slice(0, 400);

      console.log(
        `::error title=${id} ${score(category.score)} on ${page}::${ref.id}: ${audit.title}${
          items ? ` — ${items}` : ''
        }`
      );
    }
  }
}

if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    [
      '### Lighthouse',
      '',
      '| Page | Performance | Accessibility | Best practices | SEO | |',
      '| --- | --- | --- | --- | --- | --- |',
      ...rows,
      '',
    ].join('\n')
  );
}
