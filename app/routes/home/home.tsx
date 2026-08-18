import { Footer } from '~/components/footer';
import { baseMeta } from '~/utils/meta';
import { Intro } from './intro';
import { Profile } from './profile';
import { ProjectSummary } from './project-summary';
import { useEffect, useRef, useState } from 'react';
import { projects, projectPath } from '~/data/projects';
import { projectModels } from '~/data/project-models';
import config from '~/config.json';
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

export const Home = () => {
  // Tracked by element id rather than by ref, so nothing has to read
  // `ref.current` during render to decide what's visible.
  const [visibleSections, setVisibleSections] = useState(() => new Set());
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);
  const intro = useRef<HTMLElement>(null);
  const details = useRef<HTMLElement>(null);
  const projectRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          observer.unobserve(entry.target);
          setVisibleSections(previous => new Set(previous).add(entry.target.id));
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );

    const indicatorObserver = new IntersectionObserver(
      ([entry]) => {
        setScrollIndicatorHidden(!entry?.isIntersecting);
      },
      { rootMargin: '-100% 0px 0px 0px' }
    );

    const sections = [intro.current, ...projectRefs.current, details.current];

    sections.forEach(section => {
      if (section) sectionObserver.observe(section);
    });

    if (intro.current) indicatorObserver.observe(intro.current);

    return () => {
      sectionObserver.disconnect();
      indicatorObserver.disconnect();
    };
  }, []);

  return (
    <div className={styles.home}>
      <Intro
        id="intro"
        sectionRef={intro}
        scrollIndicatorHidden={scrollIndicatorHidden}
      />
      {projects.map((project, index) => {
        const id = `project-${index + 1}`;

        return (
          <ProjectSummary
            key={project.slug}
            id={id}
            sectionRef={(element: HTMLElement | null) => {
              projectRefs.current[index] = element;
            }}
            visible={visibleSections.has(id)}
            index={index + 1}
            alternate={index % 2 === 1}
            title={project.title}
            description={project.description}
            buttonText="View project"
            buttonLink={projectPath(project.slug)}
            model={projectModels[project.slug]}
          />
        );
      })}
      <Profile
        sectionRef={details}
        visible={visibleSections.has('details')}
        id="details"
      />
      <Footer />
    </div>
  );
};
