import scHowItWorks from '~/assets/sc-how-it-works.gif';
import scAnimateBox from '~/assets/sc-animate-box.gif';
import sliceTextureLarge from '~/assets/slice-app-large.jpg';
import sliceTexturePlaceholder from '~/assets/slice-app-placeholder.jpg';
import sliceTexture from '~/assets/slice-app.jpg';
import mmDashboardImage from '~/assets/mm-analytics-dashboard.png';
import mmScreenMonitoring from '~/assets/mm-screen-monitoring.png';
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
  const [visibleSections, setVisibleSections] = useState([]);
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);
  const intro = useRef();
  const projectOne = useRef();
  const projectTwo = useRef();
  const projectThree = useRef();
  const details = useRef();
  const observedSections = useRef(new Set());

  useEffect(() => {
    const sections = [intro, projectOne, projectTwo, projectThree, details];

    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const section = entry.target;
            observer.unobserve(section);
            if (observedSections.current.has(section)) return;
            observedSections.current.add(section);
            setVisibleSections(prevSections => [...prevSections, section]);
          }
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
      sectionObserver.observe(section.current);
    });

    indicatorObserver.observe(intro.current);

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
        visible={visibleSections.includes(projectOne.current)}
        index={1}
        title="Mera Monitor — Employee Productivity Platform"
        description="Lead front-end development for a fintech SaaS product with 3,500+ active users, featuring real-time monitoring, Redux state management, and SSO authentication."
        buttonText="View project"
        buttonLink="/projects/smart-sparrow"
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
        visible={visibleSections.includes(projectTwo.current)}
        index={2}
        title="Screen Coach — Screen Time Monitoring"
        description="Developed responsive UI and RESTful APIs for a screen-time monitoring tool optimized for low-memory devices using Node.js and MongoDB."
        buttonText="View project"
        buttonLink="/projects/volkihar-knight"
        model={{
          type: 'phone',
          alt: 'Screen Coach app showing screen time analytics',
          textures: [
            {
              srcSet: `${scAnimateBox} 375w`,
              placeholder: scAnimateBox,
            },
            {
              srcSet: `${scHowItWorks} 375w`,
              placeholder: scHowItWorks,
            },
          ],
        }}
      />
      <ProjectSummary
        id="project-3"
        sectionRef={projectThree}
        visible={visibleSections.includes(projectThree.current)}
        index={3}
        title="UI Integration — Messaging Automation"
        description="Designed and implemented user interfaces for WhatsApp, Telegram, and SMS automation integrations with cross-browser compatibility and responsive design."
        buttonText="View project"
        buttonLink="/projects/slice"
        model={{
          type: 'laptop',
          alt: 'Messaging automation integration interface',
          textures: [
            {
              srcSet: `${sliceTexture} 800w, ${sliceTextureLarge} 1920w`,
              placeholder: sliceTexturePlaceholder,
            },
          ],
        }}
      />
      <Profile
        sectionRef={details}
        visible={visibleSections.includes(details.current)}
        id="details"
      />
      <Footer />
    </div>
  );
};
