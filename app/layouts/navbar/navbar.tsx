import { Icon } from '~/components/icon';
import { Monogram } from '~/components/monogram';
import { useScrollToHash } from '~/hooks';
import { Link as RouterLink, useLocation } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { ThemeToggle } from './theme-toggle';
import { navLinks, socialLinks } from './nav-data';
import config from '~/config.json';
import styles from './navbar.module.css';

export const Navbar = () => {
  const [current, setCurrent] = useState<string>();
  const [target, setTarget] = useState<string>();
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);
  const scrollToHash = useScrollToHash();

  useEffect(() => {
    // Prevent ssr mismatch by storing this in state
    setCurrent(`${location.pathname}${location.hash}`);
  }, [location]);

  // Handle smooth scroll nav items
  useEffect(() => {
    if (!target || location.pathname !== '/') return;
    setCurrent(`${location.pathname}${target}`);
    scrollToHash(target, () => setTarget(undefined));
  }, [location.pathname, scrollToHash, target]);

  // Check if a nav item should be active
  const getCurrent = (url = ''): 'page' | undefined => {
    const nonTrailing = current?.endsWith('/') ? current.slice(0, -1) : current;

    return url === nonTrailing ? 'page' : undefined;
  };

  // Store the current hash to scroll to
  const handleNavItemClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const hash = event.currentTarget.href.split('#')[1];
    setTarget(undefined);

    if (hash && location.pathname === '/') {
      setTarget(`#${hash}`);
      event.preventDefault();
    }
  };

  return (
    <header className={styles.navbar} ref={headerRef}>
      {/* logo */}
      <RouterLink
        prefetch="intent"
        to={location.pathname === '/' ? '/#intro' : '/'}
        data-navbar-item
        className={styles.logo}
        aria-label={`${config.name}, ${config.role}`}
        onClick={handleNavItemClick}
      >
        <Monogram highlight />
      </RouterLink>
     {/* nav */}
      <nav className={styles.nav}>
        <div className={styles.navList}>
          {navLinks.map(({ label, pathname }) => (
            <RouterLink
              prefetch="intent"
              to={pathname}
              key={label}
              data-navbar-item
              className={styles.navLink}
              aria-current={getCurrent(pathname)}
              onClick={handleNavItemClick}
            >
              {label}
            </RouterLink>
          ))}
        </div>
        {/* Right navbar */}
        <NavbarIcons desktop />
      </nav>
      
      <ThemeToggle data-navbar-item />
    </header>
  );
};

const NavbarIcons = ({ desktop }: { desktop?: boolean }) => (
  <div className={styles.navIcons}>
    {socialLinks.map(({ label, url, icon }) => (
      <a
        key={label}
        data-navbar-item={desktop || undefined}
        className={styles.navIconLink}
        aria-label={label}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon className={styles.navIcon} icon={icon} />
      </a>
    ))}
  </div>
);
