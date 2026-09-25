/**
 * Report Lighthouse results where they can be read without digging through
 * logs: a table in the job summary, one annotation per page with its scores,
 * and one per audit that is costing points in a category below target.
 *
 * A page that produced no report at all is named too, with the error the
 * collect step recorded for it. `lhci collect` stops at the first page it
 * can't audit, so /contact once failed as a bare "exit code 1" with nothing
 * saying which page or why.
 *
 * Run after `lhci collect` (and `lhci upload`, for report links).
 * Usage: node scripts/lighthouse-summary.cjs
 *
 * Environment (both optional):
 *   LIGHTHOUSE_PATHS   space-separated paths that should have a report
 *   LIGHTHOUSE_ERRORS  file of "path<TAB>error" lines from the collect step
 */
const fs = require('node:fs');
const path = require('node:path');

const DIR = path.join(process.cwd(), '.lighthouseci');
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];
/** Mirrors the error-level assertions in .lighthouserc.json. */
const TARGET = { accessibility: 0.95, 'best-practices': 0.95, seo: 0.95 };

const expected = (process.env.LIGHTHOUSE_PATHS ?? '').split(/\s+/).filter(Boolean);
const collectErrors = new Map();

try {
  for (const line of fs.readFileSync(process.env.LIGHTHOUSE_ERRORS, 'utf8').split('\n')) {
    const [page, ...error] = line.split('\t');
    if (page) collectErrors.set(page, error.join(' ').trim());
  }
} catch {
  // No errors file: nothing failed to collect, or the step never got that far.
}

// Annotation text can't span lines, and GitHub truncates long messages anyway.
const oneLine = text => text.replace(/\s+/g, ' ').trim().slice(0, 600);

const reports = fs.existsSync(DIR)
  ? fs
      .readdirSync(DIR)
      .filter(file => /^lhr-.*\.json$/.test(file))
      .map(file => JSON.parse(fs.readFileSync(path.join(DIR, file), 'utf8')))
  : [];

if (!reports.length && !expected.length) {
  console.log('::warning title=Lighthouse::No .lighthouseci results to summarise.');
  process.exit(0);
}

let links = {};
try {
  links = JSON.parse(fs.readFileSync(path.join(DIR, 'links.json'), 'utf8'));
} catch {
  // No upload ran, or it failed; the scores are still worth reporting.
}

const score = value => (value === null || value === undefined ? '–' : Math.round(value * 100));
const rows = [];
const reported = new Set();

for (const lhr of reports) {
  const url = lhr.finalDisplayedUrl ?? lhr.requestedUrl;
  const page = new URL(url).pathname;

  reported.add(new URL(lhr.requestedUrl).pathname);
  reported.add(page);

  if (lhr.runtimeError) {
    console.log(
      `::error title=Lighthouse ${page}::${lhr.runtimeError.code}: ${oneLine(lhr.runtimeError.message)}`
    );
    rows.push(`| ${page} | ${lhr.runtimeError.code} | | | | |`);
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

for (const page of new Set([...expected, ...collectErrors.keys()])) {
  if (reported.has(page)) continue;

  const error = oneLine(collectErrors.get(page) || 'no error recorded; see the Lighthouse step log');

  console.log(`::error title=Lighthouse ${page} — no report::${error}`);
  rows.push(`| ${page} | not collected: ${error.replace(/\|/g, '\\|')} | | | | |`);
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
