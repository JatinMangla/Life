import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Input } from './input';

/**
 * Regression test. `onInvalid` was not destructured, so it flowed through
 * `...rest` onto the wrapper div. The `invalid` event does not bubble, so the
 * handler never ran: the native validation bubble was never suppressed and
 * the styled error message never appeared.
 */
describe('Input', () => {
  it('attaches onInvalid to the field, not the wrapper', () => {
    const onInvalid = vi.fn();

    render(<Input label="Your email" name="email" required onInvalid={onInvalid} />);

    const field = screen.getByLabelText('Your email');

    field.dispatchEvent(new Event('invalid', { bubbles: false }));

    expect(onInvalid).toHaveBeenCalledTimes(1);
  });

  it('associates its label with the field', () => {
    render(<Input label="Your name" name="name" />);

    expect(screen.getByLabelText('Your name')).toBeInTheDocument();
  });

  it('exposes the error message in an alert region tied to the field', () => {
    render(<Input label="Your email" name="email" error="Please enter a valid email." />);

    const alert = screen.getByRole('alert');
    const field = screen.getByLabelText('Your email');

    expect(alert).toHaveTextContent('Please enter a valid email.');
    expect(field).toHaveAttribute('aria-describedby', alert.id);
    expect(field).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders a textarea when multiline', () => {
    render(<Input multiline label="Message" name="message" />);

    expect(screen.getByLabelText('Message').tagName).toBe('TEXTAREA');
  });
});
