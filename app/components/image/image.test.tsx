import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Image } from './image';

describe('Image', () => {
  it('renders the alt text it is given', () => {
    render(
      <Image
        src="/photo.jpg"
        placeholder="/photo-placeholder.jpg"
        alt="A descriptive alt"
        width={800}
        height={600}
      />
    );

    expect(screen.getByAltText('A descriptive alt')).toBeInTheDocument();
  });

  it('always sets width and height, so images do not shift layout', () => {
    render(
      <Image
        src="/photo.jpg"
        placeholder="/photo-placeholder.jpg"
        alt="A photo"
        width={800}
        height={600}
      />
    );

    const image = screen.getByAltText('A photo');

    expect(image).toHaveAttribute('width', '800');
    expect(image).toHaveAttribute('height', '600');
  });

  it('hides the placeholder from assistive tech', () => {
    const { container } = render(
      <Image
        src="/photo.jpg"
        placeholder="/photo-placeholder.jpg"
        alt="A photo"
        width={800}
        height={600}
      />
    );

    const placeholder = container.querySelector('img[role="presentation"]');

    expect(placeholder).toHaveAttribute('aria-hidden');
    expect(placeholder).toHaveAttribute('alt', '');
  });

  it('lazy-loads the real image rather than the placeholder', () => {
    const { container } = render(
      <Image
        src="/photo.jpg"
        placeholder="/photo-placeholder.jpg"
        alt="A photo"
        width={800}
        height={600}
      />
    );

    expect(screen.getByAltText('A photo')).toHaveAttribute('loading', 'lazy');
    expect(container.querySelector('img[role="presentation"]')).not.toHaveAttribute(
      'loading'
    );
  });
});
