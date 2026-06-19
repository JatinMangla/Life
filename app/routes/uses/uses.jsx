import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import usesBackgroundPlaceholder from '~/assets/uses-background-placeholder.jpg';
import usesBackground from '~/assets/uses-background.mp4';
import { Footer } from '~/components/footer';
import { Link } from '~/components/link';
import { Table, TableBody, TableCell, TableHeadCell, TableRow } from '~/components/table';
import {
  ProjectBackground,
  ProjectContainer,
  ProjectHeader,
  ProjectSection,
  ProjectSectionContent,
  ProjectSectionHeading,
} from '~/layouts/project';
import { baseMeta } from '~/utils/meta';
import styles from './uses.module.css';

export const meta = () => {
  return baseMeta({
    title: 'Uses',
    description:
      'A list of tools, frameworks, and technologies I use to build modern web applications',
  });
};

const springConfig = { stiffness: 220, damping: 18, mass: 0.6 };

// Floating tech badges that scroll in an infinite marquee
const marqueeTags = [
  'React.js',
  'TypeScript',
  'Node.js',
  'GraphQL',
  'Redux',
  'MongoDB',
  'PostgreSQL',
  'Vite',
  'Express.js',
  'Firebase',
  'Tailwind CSS',
  'React Query',
  'Jest',
];

const categories = [
  {
    id: 'frontend',
    label: 'Frontend',
    accent: '202.24',
    icon: MonitorIcon,
    intro: 'Crafting fast, accessible, pixel-perfect interfaces.',
    items: [
      <>
        <Link href="https://reactjs.org/">React.js</Link> is my primary framework for
        building interactive UIs, paired with{' '}
        <Link href="https://www.typescriptlang.org/">TypeScript</Link> for type safety and
        a sharper developer experience.
      </>,
      <>
        State managed with <Link href="https://redux.js.org/">Redux</Link> (Thunk + Saga)
        and <Link href="https://tanstack.com/query">React Query</Link> for server-state
        synchronization.
      </>,
      <>
        Styling with SCSS modules, Tailwind CSS, and Material UI &mdash; always responsive,
        cross-browser, and accessible.
      </>,
      <>
        Data-heavy UIs built with React Table, ApexCharts, Formik, and list
        virtualization for buttery-smooth performance.
      </>,
      <>
        Scroll-driven motion and micro-interactions with{' '}
        <Link href="https://www.framer.com/motion/">Framer Motion</Link> to make every
        transition feel intentional.
      </>,
    ],
  },
  {
    id: 'backend',
    label: 'Backend & APIs',
    accent: '150',
    icon: ServerIcon,
    intro: 'Robust services that scale under real-world load.',
    items: [
      <>
        <Link href="https://nodejs.org/">Node.js</Link> with{' '}
        <Link href="https://expressjs.com/">Express.js</Link> for RESTful APIs and
        server-side logic.
      </>,
      <>
        <Link href="https://www.mongodb.com/">MongoDB</Link> with Mongoose, PostgreSQL for
        relational data, and Firebase for real-time features.
      </>,
      <>
        Real-time communication via SignalR, WebSockets, and GraphQL, secured with JWT
        authentication.
      </>,
      <>
        Enterprise SSO with Microsoft MSAL and Google OAuth, shipped to production
        applications.
      </>,
    ],
  },
  {
    id: 'tools',
    label: 'Development Tools',
    accent: '60',
    icon: WrenchIcon,
    intro: 'The workbench that keeps shipping smooth.',
    items: [
      <>
        <Link href="https://code.visualstudio.com/">VS Code</Link> with ESLint, Prettier,
        and SonarQube guarding code quality.
      </>,
      <>
        <Link href="https://vitejs.dev/">Vite</Link>, Webpack, and Babel for bundling;
        PM2 and Nodemon for server management.
      </>,
      <>
        Git, GitHub, and GitLab for version control. Postman for API testing, Vercel for
        deployment.
      </>,
      <>
        <Link href="https://jestjs.io/">Jest</Link> for unit testing and Storybook for
        building UI components in isolation.
      </>,
    ],
  },
];

const stackSummary = [
  ['Languages', 'JavaScript, TypeScript, HTML5, CSS3, SCSS'],
  ['Frameworks', 'React.js, Redux, React Router, Express.js'],
  ['Databases', 'MongoDB, PostgreSQL, Firebase'],
  ['Build Tools', 'Vite, Webpack, Babel, ESLint, Prettier'],
  ['APIs', 'GraphQL, REST, SignalR, WebSockets'],
  ['Auth', 'Microsoft MSAL, Google OAuth, JWT'],
  ['Testing', 'Jest, Storybook, SonarQube'],
  ['Methodology', 'Agile/Scrum, Lean'],
];

export const Uses = () => {
  return (
    <>
      <ProjectContainer className={styles.uses}>
        <ProjectBackground
          src={usesBackground}
          placeholder={usesBackgroundPlaceholder}
          opacity={0.7}
        />
        <ProjectHeader
          title="Uses"
          description="The tools, frameworks, and technologies I reach for every day to build high-performance, delightful web applications — from React on the frontend to Node.js and databases on the backend."
        />

        <ProjectSection padding="none" className={styles.marqueeSection}>
          <Marquee tags={marqueeTags} />
        </ProjectSection>

        <ProjectSection padding="none" className={styles.gridSection}>
          <ProjectSectionContent width="l">
            <div className={styles.grid}>
              {categories.map((category, index) => (
                <TiltCard key={category.id} category={category} index={index} />
              ))}
            </div>
          </ProjectSectionContent>
        </ProjectSection>

        <ProjectSection padding="none" className={styles.summarySection}>
          <ProjectSectionContent width="l">
            <motion.div
              className={styles.summaryInner}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            >
              <ProjectSectionHeading>Tech Stack Summary</ProjectSectionHeading>
              <div className={styles.tableWrap}>
                <Table>
                  <TableBody>
                    {stackSummary.map(([label, value]) => (
                      <TableRow key={label}>
                        <TableHeadCell>{label}</TableHeadCell>
                        <TableCell>{value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContainer>
      <Footer />
    </>
  );
};

function TiltCard({ category, index }) {
  const { label, accent, intro, items, icon: Icon } = category;
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [9, -9]), springConfig);
  const rotateY = useSpring(useTransform(px, [0, 1], [-9, 9]), springConfig);

  const handleMove = event => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width;
    const ny = (event.clientY - rect.top) / rect.height;
    px.set(nx);
    py.set(ny);
    ref.current.style.setProperty('--mouse-x', `${nx * 100}%`);
    ref.current.style.setProperty('--mouse-y', `${ny * 100}%`);
  };

  const handleLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.article
      ref={ref}
      className={styles.card}
      style={{
        '--accent': accent,
        rotateX: reduceMotion ? 0 : rotateX,
        rotateY: reduceMotion ? 0 : rotateY,
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className={styles.cardGlow} aria-hidden />
      <div className={styles.cardContent}>
        <div className={styles.cardHead}>
          <span className={styles.cardIcon} aria-hidden>
            <Icon />
          </span>
          <span className={styles.cardIndex} aria-hidden>
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <h3 className={styles.cardTitle}>{label}</h3>
        <p className={styles.cardIntro}>{intro}</p>
        <ul className={styles.cardList}>
          {items.map((item, i) => (
            <li className={styles.cardItem} key={i}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}

function Marquee({ tags }) {
  const reduceMotion = useReducedMotion();
  const row = [...tags, ...tags];

  return (
    <div className={styles.marquee} data-static={reduceMotion || undefined}>
      <div className={styles.marqueeTrack}>
        {row.map((tag, i) => (
          <span className={styles.tag} key={`${tag}-${i}`}>
            <span className={styles.tagDot} aria-hidden />
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

/* --- Inline category icons (stroke-based, inherit currentColor) --- */

function MonitorIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden focusable="false">
      <rect
        x="2.5"
        y="3.5"
        width="19"
        height="13"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8 20.5h8M12 16.5v4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ServerIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden focusable="false">
      <rect
        x="3"
        y="3.5"
        width="18"
        height="7"
        rx="1.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <rect
        x="3"
        y="13.5"
        width="18"
        height="7"
        rx="1.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M7 7h.01M7 17h.01"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WrenchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden focusable="false">
      <path
        d="M14.5 4.5a4.5 4.5 0 0 0-5.9 5.7L3.4 15.4a2 2 0 0 0 2.8 2.8l5.2-5.2a4.5 4.5 0 0 0 5.7-5.9l-2.6 2.6-2.5-.7-.7-2.5 2.7-2.6z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

Uses.displayName = 'Uses';
