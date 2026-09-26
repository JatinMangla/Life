import { Button } from '~/components/button';
import { ProjectPreview } from '~/components/project-preview';
import { Section } from '~/components/section';
import { ProjectReveal } from '~/layouts/project/project-reveal';
import { useState } from 'react';
import type { PointerEvent, Ref } from 'react';
import type { ProjectModel, ProjectSlug } from '~/data/projects';
import { cssProps } from '~/utils/style';
import styles from './project-summary.module.css';

export interface ProjectSummaryProps {
  id: string;
  sectionRef: Ref<HTMLElement>;
  slug: ProjectSlug;
  /** 1-based position, rendered as the index number. */
  index: number;
  /** How many projects there are, for the "01 / 06" counter. */
  total: number;
  title: string;
  description: string;
  /** A device with a real screenshot. Projects without one get a 3D scene. */
  model?: ProjectModel;
  stack: readonly string[];
  /** OKLCH hue for the card's glow and the poster fallback. */
  hue: string;
  /** Small label above the title. */
  eyebrow: string;
  buttonText: string;
  buttonLink: string;
  /** Mirror the layout, putting the preview on the left. */
  alternate?: boolean;
}

export function ProjectSummary({
  id,
  sectionRef,
  slug,
  index,
  total,
  title,
  description,
  model,
  stack,
  hue,
  eyebrow,
  buttonText,
  buttonLink,
  alternate,
}: ProjectSummaryProps) {
  const [active, setActive] = useState(false);
  const titleId = `${id}-title`;
  const pad = (value: number) => String(value).padStart(2, '0');

  // Written straight to CSS variables: a state update per pointer move would
  // re-render the card, and the WebGL scene inside it, at 60+ Hz.
  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();

    event.currentTarget.style.setProperty('--spotX', `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty('--spotY', `${event.clientY - bounds.top}px`);
  };


  return (
    <Section
      className={styles.summary}
      as="section"
      aria-labelledby={titleId}
      ref={sectionRef}
      id={id}
      tabIndex={-1}
    >
      <ProjectReveal stagger={0}>
        <article
          className={styles.card}
          data-alternate={alternate}
          data-active={active}
          style={cssProps({ hue })}
          onPointerMove={handlePointerMove}
          onPointerEnter={() => setActive(true)}
          onPointerLeave={() => setActive(false)}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
        >
          <div className={styles.details}>
            <p className={styles.meta}>
              <span className={styles.index}>
                {pad(index)}
                <span className={styles.total}> / {pad(total)}</span>
              </span>
              <span className={styles.kind}>{eyebrow}</span>
            </p>
            <h2 className={styles.title} id={titleId}>
              {title}
            </h2>
            <p className={styles.description}>{description}</p>
            <ul className={styles.stack} aria-label="Built with">
              {stack.slice(0, 5).map(item => (
                <li key={item} className={styles.chip}>
                  {item}
                </li>
              ))}
              {stack.length > 5 && (
                <li className={styles.chip} data-more>
                  +{stack.length - 5} more
                </li>
              )}
            </ul>
            <Button iconHoverShift href={buttonLink} iconEnd="arrow-right" className={styles.button}>
              {buttonText}
            </Button>
          </div>
          <div className={styles.stage}>
            <ProjectPreview
              slug={slug}
              title={title}
              stack={stack}
              hue={hue}
              model={model}
              active={active}
            />
          </div>
        </article>
      </ProjectReveal>
    </Section>
  );
}
