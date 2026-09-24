import { Button } from '~/components/button';
import { Divider } from '~/components/divider';
import { Heading } from '~/components/heading';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import type { Ref } from 'react';
import config from '~/config.json';
import { formatMonth, timeline } from '~/data/experience';
import activity from '~/data/github-activity.json';
import { Link } from '~/components/link';
import { projectPath } from '~/data/projects';
import { cssProps, numToMs } from '~/utils/style';
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
  visible: boolean;
  sectionRef: Ref<HTMLElement>;
}

/**
 * Where I've worked, rendered from `timeline` in experience.ts. The data
 * existed from the start; nothing on the site showed it, so the only work
 * history a recruiter could find was implied by the project cards.
 */
export const Experience = ({ id, visible, sectionRef }: ExperienceProps) => {
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
        <div className={styles.tag} aria-hidden>
          <Divider
            notchWidth="64px"
            notchHeight="8px"
            collapsed={!visible}
            collapseDelay={600}
          />
          <div className={styles.tagText} data-visible={visible}>
            Experience
          </div>
        </div>
        <Heading level={3} as="h2" id={titleId} className={styles.title} data-visible={visible}>
          Where I&rsquo;ve worked
        </Heading>
        <ol className={styles.list}>
          {timeline.map((entry, index) => (
            <li
              key={entry.organisation}
              className={styles.entry}
              data-visible={visible}
              style={cssProps({ delay: numToMs(300 + index * 150) })}
            >
              <div className={styles.meta}>
                <Text size="s" as="p" className={styles.period}>
                  <time dateTime={entry.startedAt}>{formatMonth(entry.startedAt)}</time>
                  {' – '}
                  {entry.endedAt ? (
                    <time dateTime={entry.endedAt}>{formatMonth(entry.endedAt)}</time>
                  ) : (
                    'Present'
                  )}
                </Text>
                {entry.location && (
                  <Text size="s" as="p" className={styles.location}>
                    {entry.location}
                  </Text>
                )}
              </div>
              <div>
                <Heading level={5} as="h3" className={styles.role}>
                  {entry.role}
                  <span className={styles.organisation}> · {entry.organisation}</span>
                </Heading>
                <ul className={styles.highlights}>
                  {entry.highlights.map(highlight => (
                    <li key={highlight.slice(0, 32)}>
                      <Text size="s" as="span">
                        {highlight}
                      </Text>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
        {activity.repos.length > 0 && (
          <div className={styles.activity} data-visible={visible}>
            <Heading level={5} as="h3" className={styles.activityTitle}>
              Latest commits
            </Heading>
            {/* A committed snapshot from scripts/github-activity.cjs, not a
                live API call — so every entry carries its own date. */}
            <ul className={styles.activityList}>
              {activity.repos.map(repo => (
                <li key={repo.name} className={styles.activityItem}>
                  <Text size="s" as="p" className={styles.activityMeta}>
                    <Link href={repo.url}>{repo.name}</Link>
                    {' · '}
                    <time dateTime={repo.commit.date}>{formatDay(repo.commit.date)}</time>
                    {repo.caseStudy && (
                      <>
                        {' · '}
                        <Link href={projectPath(repo.caseStudy)}>case study</Link>
                      </>
                    )}
                  </Text>
                  <Text size="s" as="p">
                    <Link secondary href={repo.commit.url}>
                      {repo.commit.subject}
                    </Link>
                  </Text>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className={styles.actions} data-visible={visible}>
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
