import type { CSSProperties } from 'react';

/**
 * Media query breakpoints, in px. Kept in sync with the custom media queries
 * declared in app/global.css.
 */
export const media = {
  desktop: 2080,
  laptop: 1680,
  tablet: 1040,
  mobile: 696,
  mobileS: 400,
} as const;

export type Breakpoint = keyof typeof media;

/** Convert a px string to a number. */
export const pxToNum = (px: string): number => Number(px.replace('px', ''));

/** Convert a number to a px string. */
export const numToPx = (num: number): string => `${num}px`;

/** Convert pixel values to rem for a11y. */
export const pxToRem = (px: number): string => `${px / 16}rem`;

/**
 * Convert ms token values to raw numbers for react-transition-group
 * transition delay props.
 */
export const msToNum = (msString: string): number => Number(msString.replace('ms', ''));

/** Convert a number to an ms string. */
export const numToMs = (num: number): string => `${num}ms`;

/**
 * Convert an rgb theme property (e.g. rgbBlack: '0 0 0') to values that can be
 * spread into a three.js Color.
 */
export const rgbToThreeColor = (rgb?: string): number[] =>
  rgb?.split(' ').map(value => Number(value) / 255) ?? [];

export type CssPropsInput = Record<string, string | number | undefined>;

/**
 * Convert a plain object into `--` prefixed CSS custom properties, optionally
 * merged with normal style declarations.
 */
export function cssProps(props: CssPropsInput, style: CSSProperties = {}): CSSProperties {
  const result: Record<string, string | number> = {};

  for (const [key, rawValue] of Object.entries(props)) {
    if (rawValue === undefined) continue;

    let value: string | number = rawValue;

    if (typeof value === 'number') {
      if (key === 'delay') {
        value = numToMs(value);
      } else if (key === 'opacity') {
        value = `${value * 100}%`;
      } else {
        value = numToPx(value);
      }
    }

    result[`--${key}`] = value;
  }

  return { ...result, ...style } as CSSProperties;
}

/** Concatenate class names, dropping anything falsy. */
export function classes(...values: (string | false | null | undefined)[]): string {
  return values.filter(Boolean).join(' ');
}
