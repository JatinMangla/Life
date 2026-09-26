import { Button } from '~/components/button';
import { Section } from '~/components/section';
import type { Ref } from 'react';
import config from '~/config.json';
import { formatMonth, timeline } from '~/data/experience';
import activity from '~/data/github-activity.json';
import { Link } from '~/components/link';
import { projectPath } from '~/data/projects';
import { ProjectReveal } from '~/layouts/project/project-reveal';
import styles from './experience.module.css';

/** "19 Sept 2026" */
function formatDay(value: string): string {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export interface ExperienceProps {
  id: string;
  sectionRef: Ref<HTMLElement>;
}

/**
 * Where I've worked, rendered from `timeline` in experience.ts, followed by
 * the latest commits snapshot and the résumé.
 */
export const Experience = ({ id, sectionRef }: ExperienceProps) => {
  const titleId = `${id}-title`;

  return (
    <Section
      className={styles.experience}
      as="section"
      id={id}
      ref={sectionRef}
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <div className={styles.content}>
        <ProjectReveal>
          <p className={styles.eyebrow}>Experience</p>
          <h2 id={titleId} className={styles.title}>
            Where I&rsquo;ve worked
          </h2>
        </ProjectReveal>
        <ProjectReveal stagger={150}>
          <ol className={styles.list}>
            {timeline.map(entry => (
              <li key={entry.organisation} className={styles.entry}>
                <span aria-hidden className={styles.node} data-current={!entry.endedAt} />
                <div className={styles.entryCard}>
                  <div className={styles.meta}>
                    <p className={styles.period}>
                      <time dateTime={entry.startedAt}>{formatMonth(entry.startedAt)}</time>
                      {' – '}
                      {entry.endedAt ? (
                        <time dateTime={entry.endedAt}>{formatMonth(entry.endedAt)}</time>
                      ) : (
                        'Present'
                      )}
                    </p>
                    {entry.location && <p className={styles.location}>{entry.location}</p>}
                  </div>
                  <h3 className={styles.role}>
                    {entry.role}
                    <span className={styles.organisation}>{entry.organisation}</span>
                  </h3>
                  <ul className={styles.highlights}>
                    {entry.highlights.map(highlight => (
                      <li key={highlight.slice(0, 32)}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </ProjectReveal>
        {activity.repos.length > 0 && (
          <ProjectReveal stagger={80}>
            <h3 className={styles.activityTitle}>
              <span aria-hidden className={styles.liveDot} />
              Latest commits
            </h3>
            {/* A committed snapshot from scripts/github-activity.cjs, not a
                live API call — so every entry carries its own date. */}
            <ul className={styles.activityList}>
              {activity.repos.map(repo => (
                <li key={repo.name} className={styles.activityItem}>
                  <p className={styles.activityMeta}>
                    <Link href={repo.url}>{repo.name}</Link>
                    <time dateTime={repo.commit.date}>{formatDay(repo.commit.date)}</time>
                  </p>
                  <p className={styles.activitySubject}>
                    <Link secondary href={repo.commit.url}>
                      {repo.commit.subject}
                    </Link>
                  </p>
                  {repo.caseStudy && (
                    <p className={styles.activityCase}>
                      <Link href={projectPath(repo.caseStudy)}>Case study</Link>
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </ProjectReveal>
        )}
        <div className={styles.actions}>
          {config.resume && (
            <Button href={config.resume} icon="arrow-right" download>
              Download résumé (PDF)
            </Button>
          )}
          <Button secondary href={`mailto:${config.email}`} icon="send">
            {config.email}
          </Button>
        </div>
      </div>
    </Section>
  );
};
