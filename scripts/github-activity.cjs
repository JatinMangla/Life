/**
 * Snapshot my most recent public commits into app/data/github-activity.json.
 *
 * Run by hand or by the weekly workflow, and committed. The site never calls
 * GitHub at runtime or build time: unauthenticated API calls are limited to 60
 * an hour per IP, and a shared build machine can exhaust that before this
 * script runs, which would turn a content refresh into a failed deploy.
 *
 * Usage: node scripts/github-activity.cjs   (GITHUB_TOKEN is used if set)
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const OUTPUT = path.join(ROOT, 'app', 'data', 'github-activity.json');
const { github: USER } = require(path.join(ROOT, 'app', 'config.json'));

const LIMIT = 4;
/** "Recently" means recently: a year-old commit is not what I'm shipping. */
const MAX_AGE_DAYS = 120;

/**
 * Never listed. `meramonitor-mcp-server` is written up anonymously on the
 * site, so naming its repository here would undo that; `growDhandha` is kept
 * off the portfolio by choice; `Life` is this site; the profile repo has no
 * code.
 */
const EXCLUDE = new Set(['meramonitor-mcp-server', 'growDhandha', 'Life', USER]);

/** Repositories that have a case study, so the list can link to it. */
const CASE_STUDIES = {
  'personal-vault': 'personal-vault',
  'CareerPilot-AI': 'careerpilot-ai',
  predict: 'kundli-predict',
};

async function github(pathname) {
  const response = await fetch(`https://api.github.com${pathname}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': `${USER}-portfolio`,
      ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }),
    },
  });

  if (!response.ok) {
    throw new Error(`${pathname}: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function main() {
  const repos = await github(`/users/${USER}/repos?per_page=100&sort=pushed`);
  // A few spare candidates: push order (which includes branch pushes and
  // settings changes) isn't commit order, so the final cut happens after the
  // commit dates are known.
  const candidates = repos
    .filter(repo => !repo.fork && !repo.archived && !repo.private && !EXCLUDE.has(repo.name))
    .slice(0, LIMIT + 2);

  const entries = await Promise.all(
    candidates.map(async repo => {
      const [latest] = await github(`/repos/${USER}/${repo.name}/commits?per_page=1`);

      return {
        name: repo.name,
        url: repo.html_url,
        description: repo.description ?? '',
        caseStudy: CASE_STUDIES[repo.name] ?? null,
        commit: {
          subject: latest.commit.message.split('\n')[0],
          url: latest.html_url,
          date: latest.commit.author.date.slice(0, 10),
        },
      };
    })
  );

  const cutoff = new Date(Date.now() - MAX_AGE_DAYS * 86_400_000).toISOString().slice(0, 10);
  const latest = entries
    .filter(entry => entry.commit.date >= cutoff)
    .sort((a, b) => b.commit.date.localeCompare(a.commit.date))
    .slice(0, LIMIT);

  fs.writeFileSync(
    OUTPUT,
    `${JSON.stringify({ generatedAt: new Date().toISOString().slice(0, 10), repos: latest }, null, 2)}\n`
  );

  for (const entry of latest) {
    console.info(`  ${entry.name.padEnd(24)} ${entry.commit.date}  ${entry.commit.subject}`);
  }
}

main().catch(error => {
  // Leave the committed snapshot in place: stale activity beats a broken page.
  console.error(`[github-activity] ${error.message}`);
  process.exitCode = 1;
});
