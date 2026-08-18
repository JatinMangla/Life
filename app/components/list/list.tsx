import type { HTMLAttributes, LiHTMLAttributes, ReactNode } from 'react';
import { classes } from '~/utils/style';
import styles from './list.module.css';

export interface ListProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Render an `ol` instead of a `ul`. */
  ordered?: boolean;
  children?: ReactNode;
}

export const List = ({ ordered, children, className, ...rest }: ListProps) => {
  const Element = ordered ? 'ol' : 'ul';

  return (
    <Element className={classes(styles.list, className)} {...rest}>
      {children}
    </Element>
  );
};

export interface ListItemProps extends LiHTMLAttributes<HTMLLIElement> {
  children?: ReactNode;
}

export const ListItem = ({ children, ...rest }: ListItemProps) => (
  <li className={styles.item} {...rest}>
    {children}
  </li>
);
