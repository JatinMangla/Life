import { forwardRef } from 'react';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { Link as RouterLink } from '@remix-run/react';
import { classes } from '~/utils/style';
import styles from './link.module.css';

// Static file extensions that should stay plain anchors rather than being
// handed to the client-side router.
const VALID_EXT = ['txt', 'png', 'jpg'];

function isAnchor(href?: string): boolean {
  if (!href) return false;

  const extension = href.split('.').pop();

  return (
    href.includes('://') ||
    href[0] === '#' ||
    (!!extension && VALID_EXT.includes(extension))
  );
}

export interface LinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'> {
  href?: string;
  secondary?: boolean;
  children?: ReactNode;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ rel, target, children, secondary, className, href, ...rest }, ref) => {
    const isExternal = href?.includes('://') ?? false;

    const linkProps = {
      className: classes(styles.link, className),
      'data-secondary': secondary,
      rel: rel ?? (isExternal ? 'noreferrer noopener' : undefined),
      target: target ?? (isExternal ? '_blank' : undefined),
      ref,
      ...rest,
    };

    if (isAnchor(href) || !href) {
      return (
        <a {...linkProps} href={href}>
          {children}
        </a>
      );
    }

    return (
      <RouterLink prefetch="intent" {...linkProps} to={href}>
        {children}
      </RouterLink>
    );
  }
);

Link.displayName = 'Link';
