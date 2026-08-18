import { useRouteLoaderData } from '@remix-run/react';
import { Link } from '~/components/link';
import { Text } from '~/components/text';
import { classes } from '~/utils/style';
import config from '~/config.json';
import type { RootLoaderData } from '~/root';
import styles from './footer.module.css';

export interface FooterProps {
  className?: string;
}

export const Footer = ({ className }: FooterProps) => {
  // Comes from the root loader, so server and client always agree on the year
  // even across midnight on New Year's Eve (see root.jsx).
  const year = useRouteLoaderData<RootLoaderData>('root')?.year;

  return (
    <footer className={classes(styles.footer, className)}>
      <Text size="s" align="center">
        <span className={styles.date}>{`© ${year} ${config.name}.`}</span>
        <Link secondary className={styles.link} href={config.repo}>
          Source on GitHub
        </Link>
      </Text>
      <Text size="s" align="center" className={styles.colophon}>
        Built with Remix, Three.js and CSS Modules. The visual design started from{' '}
        <Link secondary href="https://github.com/HamishMW/portfolio">
          Hamish Williams&apos; open-source portfolio
        </Link>{' '}
        and was rebuilt from there.
      </Text>
    </footer>
  );
};
