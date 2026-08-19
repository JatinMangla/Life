import { useRouteLoaderData } from '@remix-run/react';
import { Icon } from '~/components/icon';
import { Link } from '~/components/link';
import { Text } from '~/components/text';
import { classes } from '~/utils/style';
import { socialLinks } from '~/layouts/navbar/nav-data';
import config from '~/config.json';
import type { RootLoaderData } from '~/root';
import styles from './footer.module.css';

export interface FooterProps {
  className?: string;
}

export const Footer = ({ className }: FooterProps) => {
  // Comes from the root loader, so server and client always agree on the year
  // even across midnight on New Year's Eve (see root.tsx).
  const year = useRouteLoaderData<RootLoaderData>('root')?.year;

  return (
    <footer className={classes(styles.footer, className)}>
      {/* The navbar hides its social icons below 696px, so without these a
          phone visitor has no route to GitHub or LinkedIn at all. */}
      <nav className={styles.social} aria-label="Social profiles">
        {socialLinks.map(({ label, url, icon }) => (
          <a
            key={label}
            className={styles.socialLink}
            href={url}
            aria-label={`${config.name} on ${label}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon icon={icon} />
          </a>
        ))}
      </nav>
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
