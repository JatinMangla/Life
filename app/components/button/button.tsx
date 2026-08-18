import { Icon } from '~/components/icon';
import type { IconName } from '~/components/icon';
import { Loader } from '~/components/loader';
import { Transition } from '~/components/transition';
import { Link } from '@remix-run/react';
import { forwardRef } from 'react';
import type { AllHTMLAttributes, ElementType, ReactNode, Ref } from 'react';
import { classes } from '~/utils/style';
import styles from './button.module.css';

function isExternalLink(href?: string): boolean {
  return href?.includes('://') ?? false;
}

export interface ButtonProps
  extends Omit<AllHTMLAttributes<HTMLElement>, 'as' | 'size' | 'type' | 'children'> {
  /** Override the rendered element. Inferred from `href` when omitted. */
  as?: ElementType;
  children?: ReactNode;
  secondary?: boolean;
  loading?: boolean;
  loadingText?: string;
  icon?: IconName;
  iconEnd?: IconName;
  iconHoverShift?: boolean;
  iconOnly?: boolean;
  type?: 'button' | 'submit' | 'reset';
  /** Forwarded to the router when this renders as an internal link. */
  prefetch?: 'none' | 'intent' | 'render' | 'viewport';
  to?: string;
}

/**
 * Renders a `button`, an `a`, or a Remix `Link` depending on `href`: internal
 * links get client-side navigation and intent prefetching, external ones get
 * a plain anchor with the right rel/target.
 */
export const Button = forwardRef<HTMLElement, ButtonProps>(({ href, ...rest }, ref) => {
  if (isExternalLink(href) || !href) {
    return <ButtonContent href={href} ref={ref} {...rest} />;
  }

  return <ButtonContent as={Link} prefetch="intent" to={href} ref={ref} {...rest} />;
});

Button.displayName = 'Button';

const ButtonContent = forwardRef<HTMLElement, ButtonProps>(
  (
    {
      className,
      as,
      secondary,
      loading,
      loadingText = 'loading',
      icon,
      iconEnd,
      iconHoverShift,
      iconOnly,
      children,
      rel,
      target,
      href,
      disabled,
      ...rest
    },
    ref
  ) => {
    const isExternal = isExternalLink(href);
    const Component = (as ?? (href ? 'a' : 'button')) as ElementType;

    return (
      <Component
        className={classes(styles.button, className)}
        data-loading={loading}
        data-icon-only={iconOnly}
        data-secondary={secondary}
        data-icon={icon}
        href={href}
        // `??` not `||`: a caller-supplied rel/target must win. With `||` the
        // whole expression parsed as `(rel || isExternal) ? ... : ...`, which
        // silently overrode whatever the caller asked for.
        rel={rel ?? (isExternal ? 'noopener noreferrer' : undefined)}
        target={target ?? (isExternal ? '_blank' : undefined)}
        // `disabled` isn't a valid attribute on an anchor.
        disabled={Component === 'button' ? disabled : undefined}
        aria-disabled={Component === 'button' ? undefined : disabled || undefined}
        ref={ref as Ref<never>}
        {...rest}
      >
        {!!icon && (
          <Icon
            className={styles.icon}
            data-start={!iconOnly}
            data-shift={iconHoverShift}
            icon={icon}
          />
        )}
        {!!children && <span className={styles.text}>{children}</span>}
        {!!iconEnd && (
          <Icon
            className={styles.icon}
            data-end={!iconOnly}
            data-shift={iconHoverShift}
            icon={iconEnd}
          />
        )}
        <Transition unmount in={loading}>
          {({ visible, nodeRef }) => (
            <Loader
              ref={nodeRef as Ref<HTMLDivElement>}
              className={styles.loader}
              size={32}
              text={loadingText}
              data-visible={visible}
            />
          )}
        </Transition>
      </Component>
    );
  }
);

ButtonContent.displayName = 'ButtonContent';
