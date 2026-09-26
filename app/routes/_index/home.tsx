import { baseMeta } from '~/utils/meta';
import { Intro } from './intro';
import { Profile } from './profile';
import { Experience } from './experience';
import { ProjectSummary } from './project-summary';
import { useEffect, useRef, useState } from 'react';
import { projects, projectPath } from '~/data/projects';
import { projectModels } from '~/data/project-models';
import { marqueeTags } from '~/data/skills';
import { Section } from '~/components/section';
import { ProjectReveal } from '~/layouts/project/project-reveal';
import config from '~/config.json';
import { employer } from '~/data/experience';
import styles from './home.module.css';

// Prefetch draco decoder wasm
export const links = () => {
  return [
    {
      rel: 'prefetch',
      href: '/draco/draco_wasm_wrapper.js',
      as: 'script',
      type: 'text/javascript',
      importance: 'low',
    },
    {
      rel: 'prefetch',
      href: '/draco/draco_decoder.wasm',
      as: 'fetch',
      type: 'application/wasm',
      importance: 'low',
    },
  ];
};

export const meta = () => {
  return baseMeta({
    title: 'Frontend Developer',
    description: `Portfolio of ${config.name} — a frontend developer specializing in React.js and scalable web applications, with a focus on performance, 3D interactions, and modern UI/UX.`,
    path: '/',
  });
};

const numberWords = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];

/** "Two", or "12" once a word would be silly. Counts come from projects.ts. */
const countWord = (count: number, lower = false) => {
  const word = numberWords[count] ?? String(count);

  return lower ? word.toLowerCase() : word;
};

const workCount = projects.filter(project => project.kind === 'work').length;
const personalCount = projects.length - workCount;

/** The stack, scrolling past between the hero and the work. */
function TechStrip() {
  return (
    <div className={styles.strip}>
      <ul className={styles.stripTrack} aria-label="Technologies I work with">
        {marqueeTags.map(tag => (
          <li key={tag} className={styles.stripItem}>
            {tag}
          </li>
        ))}
      </ul>
      {/* The second copy makes the loop seamless; it's hidden from assistive
          tech so the list isn't read twice. */}
      <ul className={styles.stripTrack} aria-hidden>
        {marqueeTags.map(tag => (
          <li key={tag} className={styles.stripItem}>
            {tag}
          </li>
        ))}
      </ul>
    </div>
  );
}

export const Home = () => {
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);
  const intro = useRef<HTMLElement>(null);
  const details = useRef<HTMLElement>(null);
  const experience = useRef<HTMLElement>(null);
  const projectRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const indicatorObserver = new IntersectionObserver(
      ([entry]) => {
        setScrollIndicatorHidden(!entry?.isIntersecting);
      },
      { rootMargin: '-100% 0px 0px 0px' }
    );

    if (intro.current) indicatorObserver.observe(intro.current);

    return () => indicatorObserver.disconnect();
  }, []);

  return (
    <div className={styles.home}>
      <Intro
        id="intro"
        sectionRef={intro}
        scrollIndicatorHidden={scrollIndicatorHidden}
      />
      <TechStrip />
      <Section className={styles.workHeader}>
        <ProjectReveal>
          <p className={styles.eyebrow}>Selected work</p>
          <p className={styles.workTitle}>
            Things I&rsquo;ve built, <span>and how they went.</span>
          </p>
          <p className={styles.workLede}>
            {countWord(workCount)} products from my day job and {countWord(personalCount, true)}{' '}
            I designed, built and run myself. Every one has a full case study.
          </p>
        </ProjectReveal>
      </Section>
      {projects.map((project, index) => {
        const id = `project-${index + 1}`;

        return (
          <ProjectSummary
            key={project.slug}
            id={id}
            slug={project.slug}
            sectionRef={(element: HTMLElement | null) => {
              projectRefs.current[index] = element;
            }}
            index={index + 1}
            total={projects.length}
            alternate={index % 2 === 1}
            title={project.shortTitle}
            description={project.description}
            buttonText="Read the case study"
            buttonLink={projectPath(project.slug)}
            model={projectModels[project.slug]}
            stack={project.stack}
            hue={project.hue}
            eyebrow={project.kind === 'personal' ? 'Personal project' : `At ${employer.shortName}`}
          />
        );
      })}
      <Experience sectionRef={experience} id="experience" />
      <Profile sectionRef={details} id="details" />
    </div>
  );
};
