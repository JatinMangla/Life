import JostVariable from '~/assets/fonts/jost-variable.woff2';
import JostVariableItalic from '~/assets/fonts/jost-variable-italic.woff2';
import IPAGothic from '~/assets/fonts/ipa-gothic.woff2';
import { createContext, useContext } from 'react';
import type { CSSProperties, ElementType, ReactNode } from 'react';
import { classes, media } from '~/utils/style';
import { themes, tokens } from './theme';

export type ThemeId = 'dark' | 'light';

export interface ThemeContextValue {
  theme?: ThemeId;
  toggleTheme?: (theme?: ThemeId) => void;
}

export const ThemeContext = createContext<ThemeContextValue>({});

export interface ThemeProviderProps {
  theme?: ThemeId;
  children?: ReactNode;
  className?: string;
  /** Element used to scope tokens when this provider is nested. */
  as?: ElementType;
  toggleTheme?: (theme?: ThemeId) => void;
  [key: string]: unknown;
}

export const ThemeProvider = ({
  theme = 'dark',
  children,
  className,
  as: Component = 'div',
  toggleTheme,
  ...rest
}: ThemeProviderProps) => {
  const parentTheme = useTheme();
  const isRootProvider = !parentTheme.theme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme: toggleTheme || parentTheme.toggleTheme,
      }}
    >
      {isRootProvider && children}
      {/* Nested providers need a div to override theme tokens */}
      {!isRootProvider && (
        <Component className={classes(className)} data-theme={theme} {...rest}>
          {children}
        </Component>
      )}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const currentTheme = useContext(ThemeContext);
  return currentTheme;
}

/**
 * Squeeze out spaces and newlines
 */
export function squish(styles: string): string {
  return styles.replace(/\s\s+/g, ' ');
}

/**
 * Transform theme token objects into CSS custom property strings
 */
export function createThemeProperties(theme: Record<string, string | number>): string {
  return squish(
    Object.keys(theme)
      .map(key => `--${key}: ${theme[key]};`)
      .join('\n\n')
  );
}

/**
 * Transform theme tokens into a React CSSProperties object
 */
export function createThemeStyleObject(
  theme: Record<string, string | number>
): CSSProperties {
  const style: Record<string, string | number> = {};

  for (const key of Object.keys(theme)) {
    style[`--${key}`] = theme[key]!;
  }

  return style as CSSProperties;
}

/**
 * Generate media queries for tokens
 */
export function createMediaTokenProperties(): string {
  return squish(
    Object.keys(media)
      .map(key => {
        return `
        @media (max-width: ${media[key as keyof typeof media]}px) {
          :root {
            ${createThemeProperties(tokens[key as keyof typeof tokens])}
          }
        }
      `;
      })
      .join('\n')
  );
}

const tokenStyles = squish(`
  :root {
    ${createThemeProperties(tokens.base)}
  }

  ${createMediaTokenProperties()}

  [data-theme='dark'] {
    ${createThemeProperties(themes.dark)}
  }

  [data-theme='light'] {
    ${createThemeProperties(themes.light)}
  }
`);

/**
 * Jost is a variable font under the SIL Open Font License, and IPA Gothic is
 * free under the IPA Font License. One variable file covers 400-700 per style.
 *
 * Note: everything in this template literal is inlined into the <head> of
 * every server response, so keep comments out of it.
 */
const fontStyles = squish(`
  @font-face {
    font-family: Jost;
    font-weight: 400 700;
    src: url(${JostVariable}) format('woff2-variations');
    font-display: swap;
    font-style: normal;
  }

  @font-face {
    font-family: Jost;
    font-weight: 400 700;
    src: url(${JostVariableItalic}) format('woff2-variations');
    font-display: swap;
    font-style: italic;
  }

  @font-face {
    font-family: IPA Gothic;
    font-weight: 400;
    src: url(${IPAGothic}) format('woff2');
    font-display: swap;
    font-style: normal;
  }
`);

export const themeStyles = squish(`
  ${tokenStyles}
  ${fontStyles}
`);
