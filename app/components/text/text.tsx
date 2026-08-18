import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';
import { classes } from '~/utils/style';
import styles from './text.module.css';

export type TextSize = 'xl' | 'l' | 'm' | 's';
export type TextAlign = 'auto' | 'start' | 'center' | 'end';
export type TextWeight = 'auto' | 'regular' | 'medium' | 'bold';

export type TextProps<T extends ElementType = 'span'> = {
  /** Element to render as. Defaults to a span. */
  as?: T;
  children?: ReactNode;
  size?: TextSize;
  align?: TextAlign;
  weight?: TextWeight;
  secondary?: boolean;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

export const Text = <T extends ElementType = 'span'>({
  children,
  size = 'm',
  as,
  align = 'auto',
  weight = 'auto',
  secondary,
  className,
  ...rest
}: TextProps<T>) => {
  const Component = (as ?? 'span') as ElementType;

  return (
    <Component
      className={classes(styles.text, className)}
      data-align={align}
      data-size={size}
      data-weight={weight}
      data-secondary={secondary}
      {...rest}
    >
      {children}
    </Component>
  );
};
