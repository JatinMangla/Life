import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { AnchorHTMLAttributes } from 'react';
import { Button } from './button';

// Stand in for the router Link so these tests exercise Button's own logic
// rather than dragging a router (and a second copy of @remix-run/router)
// into the dependency tree.
vi.mock('@remix-run/react', () => ({
  Link: ({
    to,
    prefetch: _prefetch,
    href: _href,
    ...rest
  }: {
    to: string;
    prefetch?: string;
    // eslint-disable-next-line jsx-a11y/anchor-has-content -- children arrive via rest
  } & AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...rest} href={to} />,
}));

/**
 * Regression tests for an operator-precedence bug:
 *
 *   rel={rel || isExternal ? 'noopener noreferrer' : undefined}
 *
 * `||` binds tighter than `?:`, so this parsed as
 * `(rel || isExternal) ? ... : ...` and silently discarded whatever the
 * caller passed.
 */
describe('Button', () => {
  it('keeps a caller-supplied rel instead of overriding it', () => {
    render(
      <Button href="https://example.com" rel="me">
        Profile
      </Button>
    );

    expect(screen.getByRole('link')).toHaveAttribute('rel', 'me');
  });

  it('keeps a caller-supplied target instead of forcing _blank', () => {
    render(
      <Button href="https://example.com" target="_self">
        Same tab
      </Button>
    );

    expect(screen.getByRole('link')).toHaveAttribute('target', '_self');
  });

  it('defaults external links to a safe rel and a new tab', () => {
    render(<Button href="https://example.com">External</Button>);

    const link = screen.getByRole('link');

    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('leaves rel and target off internal links', () => {
    render(<Button href="/contact">Contact</Button>);

    const link = screen.getByRole('link');

    expect(link).not.toHaveAttribute('rel');
    expect(link).not.toHaveAttribute('target');
  });

  it('renders a button, not a link, without an href', () => {
    render(<Button>Press</Button>);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('does not put the disabled attribute on an anchor', () => {
    render(
      <Button href="https://example.com" disabled>
        Disabled
      </Button>
    );

    const link = screen.getByRole('link');

    expect(link).not.toHaveAttribute('disabled');
    expect(link).toHaveAttribute('aria-disabled', 'true');
  });
});
