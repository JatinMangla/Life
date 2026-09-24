import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import type { ComponentType, CSSProperties, MouseEvent, ReactNode } from 'react';
import usesBackgroundPlaceholder from '~/assets/uses-background-placeholder.jpg';
import usesBackground from '~/assets/uses-background.mp4';
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
import { marqueeTags, stackSummary } from '~/data/skills';
import styles from './uses.module.css';

export const meta = () => {
  return baseMeta({
    title: 'Tech Stack',
    path: '/uses',
    description:
      'The tools, frameworks and infrastructure I build with — React, TypeScript, Next.js, Node.js, the Gemini API, MCP and more.',
  });
};

const springConfig = { stiffness: 220, damping: 18, mass: 0.6 };

interface Category {
  id: string;
  label: string;
  /** OKLCH hue, fed to the card as a CSS custom property. */
  accent: string;
  icon: ComponentType;
  intro: string;
  items: ReactNode[];
}

const categories: Category[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    accent: '202.24',
    icon: MonitorIcon,
    intro: 'Fast, accessible interfaces for data-heavy products.',
    items: [
      <>
        <Link href="https://react.dev/">React</Link> and{' '}
        <Link href="https://www.typescriptlang.org/">TypeScript</Link> everywhere, with{' '}
        <Link href="https://nextjs.org/">Next.js</Link> or{' '}
        <Link href="https://remix.run/">Remix</Link> when a project needs a server.
      </>,
      <>
        Client state in <Link href="https://redux.js.org/">Redux</Link> (Thunk + Saga) only
        where it genuinely spans routes; server state in{' '}
        <Link href="https://tanstack.com/query">React Query</Link>.
      </>,
      <>
        CSS modules, SCSS and Tailwind CSS, with design tokens and cascade layers rather than
        one-off overrides.
      </>,
      <>
        Data-heavy views with React Table, ApexCharts, Formik and list virtualisation, so
        large grids stay responsive.
      </>,
      <>
        Motion with <Link href="https://www.framer.com/motion/">Framer Motion</Link> and
        three.js, respecting reduced-motion preferences.
      </>,
    ],
  },
  {
    id: 'backend',
    label: 'Backend & APIs',
    accent: '150',
    icon: ServerIcon,
    intro: 'Serverless where it fits, a real process where it doesn’t.',
    items: [
      <>
        <Link href="https://nodejs.org/">Node.js</Link> route handlers and Express APIs, most
        often deployed as Vercel functions.
      </>,
      <>
        <Link href="https://supabase.com/">Supabase</Link> Postgres with row-level security,
        MongoDB, and Upstash Redis for state that has to outlive a function instance.
      </>,
      <>
        Real-time updates over SignalR; mail over IMAP with a cursor that can&rsquo;t skip
        messages.
      </>,
      <>
        Authentication from Microsoft MSAL and Google OAuth in production to a
        self-hosted OAuth 2.1 authorization server with PKCE.
      </>,
    ],
  },
  {
    id: 'ai-infra',
    label: 'AI & Infrastructure',
    accent: '295',
    icon: SparkIcon,
    intro: 'Language models behind guard rails, on infrastructure I can afford to run.',
    items: [
      <>
        The <Link href="https://ai.google.dev/">Gemini API</Link> with schema-enforced JSON,
        streaming, response caching and concurrency limits sized to a free-tier quota.
      </>,
      <>
        Remote <Link href="https://modelcontextprotocol.io/">MCP</Link> servers that expose
        real APIs to Claude, with the limits enforced in the tools rather than the prompt.
      </>,
      <>
        Client-side encryption with the Web Crypto API: AES-GCM, PBKDF2, non-extractable
        keys.
      </>,
      <>
        Oracle Cloud VMs configured with Ansible, restic backups with restore drills, and
        Tailscale instead of open ports.
      </>,
    ],
  },
  {
    id: 'tools',
    label: 'Testing & Tooling',
    accent: '60',
    icon: WrenchIcon,
    intro: 'Tests that check the thing that actually broke last time.',
    items: [
      <>
        <Link href="https://vitest.dev/">Vitest</Link> and Testing Library for units,{' '}
        <Link href="https://playwright.dev/">Playwright</Link> with axe-core for end-to-end
        and accessibility checks.
      </>,
      <>
        GitHub Actions running lint, type checks, tests and builds on every push;
        Lighthouse against deployed previews.
      </>,
      <>
        <Link href="https://vitejs.dev/">Vite</Link> and Webpack for bundling; ESLint and
        Prettier for consistency.
      </>,
      <>Git and GitHub, Postman for API work, and Vercel for deployment.</>,
    ],
  },
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
          title="Tech Stack"
          description="What I build with day to day, and on the projects written up on this site — from React interfaces to serverless APIs, language-model integrations and the infrastructure under them."
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
                    {stackSummary.map(({ label, items }) => (
                      <TableRow key={label}>
                        <TableHeadCell>{label}</TableHeadCell>
                        <TableCell>{items}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContainer>
    </>
  );
};

interface TiltCardProps {
  category: Category;
  index: number;
}

function TiltCard({ category, index }: TiltCardProps) {
  const { label, accent, intro, items, icon: Icon } = category;
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [9, -9]), springConfig);
  const rotateY = useSpring(useTransform(px, [0, 1], [-9, 9]), springConfig);

  const handleMove = (event: MouseEvent<HTMLElement>) => {
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
      style={
        {
          '--cardHue': accent,
          rotateX: reduceMotion ? 0 : rotateX,
          rotateY: reduceMotion ? 0 : rotateY,
        } as CSSProperties
      }
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
          {items.map((item, itemIndex) => (
            <li className={styles.cardItem} key={itemIndex}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}

interface MarqueeProps {
  tags: readonly string[];
}

function Marquee({ tags }: MarqueeProps) {
  const reduceMotion = useReducedMotion();
  const row = [...tags, ...tags];

  return (
    <div className={styles.marquee} data-static={reduceMotion || undefined}>
      <div className={styles.marqueeTrack}>
        {row.map((tag, i) => (
          // The second copy only exists to make the loop seamless; screen
          // readers should hear each tag once.
          <span
            className={styles.tag}
            key={`${tag}-${i}`}
            aria-hidden={i >= tags.length || undefined}
          >
            <span className={styles.tagDot} aria-hidden />
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

/* --- Inline category icons (stroke-based, inherit currentColor) --- */

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden focusable="false">
      <path
        d="M12 3.5l2.1 5.4 5.4 2.1-5.4 2.1L12 18.5l-2.1-5.4L4.5 11l5.4-2.1L12 3.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 16.5v4M16.5 18.5h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
