import profileImgLarge from '~/assets/profileFull.jpeg';
import profileImgPlaceholder from '~/assets/profile-placeholder.jpg';
import profileImg from '~/assets/profile.jpeg';
import { Button } from '~/components/button';
import { Image } from '~/components/image';
import { Section } from '~/components/section';
import type { Ref } from 'react';
import { media } from '~/utils/style';
import { bio } from '~/data/bio';
import { employer } from '~/data/experience';
import { stackSummary } from '~/data/skills';
import { ProjectReveal } from '~/layouts/project/project-reveal';
import styles from './profile.module.css';

export interface ProfileProps {
  id: string;
  sectionRef: Ref<HTMLElement>;
}

/** The rows of the /uses table worth a glance on the home page. */
const toolkitRows = stackSummary.filter(row =>
  ['Languages', 'Frameworks', 'Data', 'AI', 'Testing'].includes(row.label)
);

export const Profile = ({ id, sectionRef }: ProfileProps) => {
  const titleId = `${id}-title`;

  return (
    <Section
      className={styles.profile}
      as="section"
      id={id}
      ref={sectionRef}
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <div className={styles.content}>
        <ProjectReveal>
          <p className={styles.eyebrow}>About me</p>
        </ProjectReveal>
        <ProjectReveal stagger={100}>
          <div className={styles.bento}>
            <div className={styles.bio} data-tile>
              <h2 className={styles.title} id={titleId}>
                Hi there
              </h2>
              {bio.map(paragraph => (
                <p key={paragraph.slice(0, 32)} className={styles.description}>
                  {paragraph}
                </p>
              ))}
              <Button className={styles.button} href="/contact" icon="send">
                Send me a message
              </Button>
            </div>
            <div className={styles.portrait} data-tile>
              <Image
                reveal
                delay={100}
                placeholder={profileImgPlaceholder}
                srcSet={`${profileImg} 480w, ${profileImgLarge} 960w`}
                width={960}
                height={1143}
                sizes={`(max-width: ${media.mobile}px) 100vw, 480px`}
                alt="Portrait of Jatin Mangla, Frontend Developer"
                className={styles.image}
              />
            </div>
            <div className={styles.now} data-tile>
              <p className={styles.tileLabel}>Currently</p>
              <p className={styles.nowRole}>{employer.role}</p>
              <p className={styles.nowPlace}>
                {employer.name}
                <br />
                {employer.location}
              </p>
            </div>
            <div className={styles.toolkit} data-tile>
              <p className={styles.tileLabel}>Toolkit</p>
              <dl className={styles.toolkitList}>
                {toolkitRows.map(row => (
                  <div key={row.label} className={styles.toolkitRow}>
                    <dt>{row.label}</dt>
                    <dd>{row.items}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </ProjectReveal>
      </div>
    </Section>
  );
};
