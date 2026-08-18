import scPhoneDashboard from '~/assets/sc-phone-dashboard.jpg';
import scPhoneDashboardPlaceholder from '~/assets/sc-phone-dashboard-placeholder.jpg';
import scPhoneRewards from '~/assets/sc-phone-rewards.jpg';
import scPhoneRewardsPlaceholder from '~/assets/sc-phone-rewards-placeholder.jpg';
import mmDashboardImage from '~/assets/mm-analytics-dashboard.png';
import { Footer } from '~/components/footer';
import { baseMeta } from '~/utils/meta';
import { Intro } from './intro';
import { Profile } from './profile';
import { ProjectSummary } from './project-summary';
import { useEffect, useRef, useState } from 'react';
import config from '~/config.json';
import styles from './home.module.css';

// Prefetch draco decoader wasm
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
    description: `Portfolio of ${config.name} — a frontend developer specializing in React.js, TypeScript, and scalable web applications with a focus on performance, 3D interactions, and modern UI/UX.`,
  });
};

export const Home = () => {
  // Tracked by element id rather than by ref, so nothing has to read
  // `ref.current` during render to decide what's visible.
  const [visibleSections, setVisibleSections] = useState(() => new Set());
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);
  const intro = useRef();
  const projectOne = useRef();
  const projectTwo = useRef();
  const details = useRef();

  useEffect(() => {
    const sections = [intro, projectOne, projectTwo, details];

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
        setScrollIndicatorHidden(!entry.isIntersecting);
      },
      { rootMargin: '-100% 0px 0px 0px' }
    );

    sections.forEach(section => {
      if (section.current) sectionObserver.observe(section.current);
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
      <ProjectSummary
        id="project-1"
        sectionRef={projectOne}
        visible={visibleSections.has('project-1')}
        index={1}
        title="Mera Monitor — Employee Productivity Platform"
        description="Lead front-end development for a fintech SaaS product with 3,500+ active users, featuring real-time monitoring, Redux state management, and SSO authentication."
        buttonText="View project"
        buttonLink="/projects/mera-monitor"
        model={{
          type: 'laptop',
          alt: 'Mera Monitor dashboard showing employee productivity metrics',
          textures: [
            {
              srcSet: `${mmDashboardImage} 1280w`,
              placeholder: mmDashboardImage,
            },
          ],
        }}
      />
      <ProjectSummary
        id="project-2"
        alternate
        sectionRef={projectTwo}
        visible={visibleSections.has('project-2')}
        index={2}
        title="Screen Coach — Screen Time Monitoring"
        description="Developed responsive UI and RESTful APIs for a screen-time monitoring tool optimized for low-memory devices using Node.js and MongoDB."
        buttonText="View project"
        buttonLink="/projects/screen-coach"
        model={{
          type: 'phone',
          alt: 'Screen Coach app showing screen time analytics',
          textures: [
            {
              srcSet: `${scPhoneDashboard} 750w`,
              placeholder: scPhoneDashboardPlaceholder,
            },
            {
              srcSet: `${scPhoneRewards} 750w`,
              placeholder: scPhoneRewardsPlaceholder,
            },
          ],
        }}
      />
      <Profile
        sectionRef={details}
        visible={visibleSections.has('details')}
        id="details"
      />
      <Footer />
    </div>
  );
};
