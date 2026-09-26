import { pxToRem } from '~/utils/style';

// Full list of tokens
const baseTokens = {
  black: 'oklch(0% 0 0)',
  white: 'oklch(100% 0 0)',
  bezierFastoutSlowin: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  durationXS: '200ms',
  durationS: '300ms',
  durationM: '400ms',
  durationL: '600ms',
  durationXL: '800ms',
  systemFontStack:
    'system-ui, -apple-system, BlinkMacSystemFont, San Francisco, Roboto, Segoe UI, Ubuntu, Helvetica Neue, sans-serif',
  fontStack: `Geist, var(--systemFontStack)`,
  monoFontStack:
    'Geist Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
  japaneseFontStack:
    'IPA Gothic, ヒラギノ角ゴ Pro W3, Hiragino Kaku Gothic Pro, Hiragino Sans, Osaka, メイリオ, Meiryo, Segoe UI, sans-serif',
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  fontSizeH0: pxToRem(140),
  fontSizeH1: pxToRem(100),
  fontSizeH2: pxToRem(58),
  fontSizeH3: pxToRem(38),
  fontSizeH4: pxToRem(28),
  fontSizeH5: pxToRem(24),
  fontSizeBodyXL: pxToRem(22),
  fontSizeBodyL: pxToRem(20),
  fontSizeBodyM: pxToRem(18),
  fontSizeBodyS: pxToRem(16),
  fontSizeBodyXS: pxToRem(14),
  lineHeightTitle: '1.05',
  radiusS: '10px',
  radiusM: '16px',
  radiusL: '28px',
  radiusFull: '999px',
  bezierOutExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  lineHeightBody: '1.6',
  maxWidthS: '540px',
  maxWidthM: '720px',
  maxWidthL: '1096px',
  maxWidthXL: '1680px',
  spaceOuter: '64px',
  spaceXS: '4px',
  spaceS: '8px',
  spaceM: '16px',
  spaceL: '24px',
  spaceXL: '32px',
  space2XL: '48px',
  space3XL: '64px',
  space4XL: '96px',
  space5XL: '128px',
  zIndex0: 0,
  zIndex1: 4,
  zIndex2: 8,
  zIndex3: 16,
  zIndex4: 32,
  zIndex5: 64,
};

// Tokens that change based on viewport size
const tokensDesktop = {
  fontSizeH0: pxToRem(120),
  fontSizeH1: pxToRem(80),
};

const tokensLaptop = {
  maxWidthS: '480px',
  maxWidthM: '640px',
  maxWidthL: '1000px',
  maxWidthXL: '1100px',
  spaceOuter: '48px',
  fontSizeH0: pxToRem(100),
  fontSizeH1: pxToRem(70),
  fontSizeH2: pxToRem(50),
  fontSizeH3: pxToRem(36),
  fontSizeH4: pxToRem(26),
  fontSizeH5: pxToRem(22),
};

const tokensTablet = {
  fontSizeH0: pxToRem(80),
  fontSizeH1: pxToRem(60),
  fontSizeH2: pxToRem(48),
  fontSizeH3: pxToRem(32),
  fontSizeH4: pxToRem(24),
  fontSizeH5: pxToRem(20),
};

const tokensMobile = {
  spaceOuter: '24px',
  fontSizeH0: pxToRem(56),
  fontSizeH1: pxToRem(40),
  fontSizeH2: pxToRem(34),
  fontSizeH3: pxToRem(28),
  fontSizeH4: pxToRem(22),
  fontSizeH5: pxToRem(18),
  fontSizeBodyL: pxToRem(17),
  fontSizeBodyM: pxToRem(16),
  fontSizeBodyS: pxToRem(14),
};

const tokensMobileSmall = {
  spaceOuter: '16px',
  fontSizeH0: pxToRem(42),
  fontSizeH1: pxToRem(38),
  fontSizeH2: pxToRem(28),
  fontSizeH3: pxToRem(24),
  fontSizeH4: pxToRem(20),
};

// Tokens that change based on theme
const dark = {
  // A faint blue cast rather than neutral grey: it's what lets the aurora
  // glows and glass surfaces read as light on a surface instead of on paint.
  background: 'oklch(14.2% 0.012 264)',
  backgroundLight: 'oklch(19.5% 0.016 264)',
  accent2: 'oklch(72% 0.19 292)',
  surface: 'color-mix(in oklab, var(--white) 4%, transparent)',
  surfaceStrong: 'color-mix(in oklab, var(--white) 7%, transparent)',
  border: 'color-mix(in oklab, var(--white) 9%, transparent)',
  borderStrong: 'color-mix(in oklab, var(--white) 16%, transparent)',
  shadow: '0 30px 80px -30px oklch(0% 0 0 / 0.7)',
  primary: 'oklch(84.42% 0.19 202.24)',
  accent: 'oklch(84.42% 0.19 202.24)',
  error: 'oklch(65.91% 0.249 13.76)',
  text: 'var(--white)',
  textTitle: 'var(--text)',
  textBody: 'color-mix(in lab, var(--text) 80%, transparent)',
  textLight: 'color-mix(in lab, var(--text) 60%, transparent)',
};

const light = {
  background: 'oklch(97% 0.006 264)',
  backgroundLight: 'var(--white)',
  accent2: 'oklch(48% 0.2 292)',
  surface: 'color-mix(in oklab, var(--white) 70%, transparent)',
  surfaceStrong: 'color-mix(in oklab, var(--white) 90%, transparent)',
  border: 'color-mix(in oklab, var(--black) 8%, transparent)',
  borderStrong: 'color-mix(in oklab, var(--black) 14%, transparent)',
  shadow: '0 30px 70px -35px oklch(35% 0.05 264 / 0.35)',
  primary: 'var(--black)',
  // Same hue and chroma as the dark theme's accent, dropped to L=47% so it
  // clears WCAG AA on the light background. The dark-theme lightness (84.42%)
  // measures 1.28:1 here — effectively invisible on #f2f2f2.
  accent: 'oklch(47% 0.19 202.24)',
  error: 'oklch(63.17% 0.259 25.41)',
  text: 'var(--black)',
  textTitle: 'color-mix(in lab, var(--text) 90%, transparent)',
  textBody: 'color-mix(in lab, var(--text) 75%, transparent)',
  textLight: 'color-mix(in lab, var(--text) 55%, transparent)',
};

export const tokens = {
  base: baseTokens,
  desktop: tokensDesktop,
  laptop: tokensLaptop,
  tablet: tokensTablet,
  mobile: tokensMobile,
  mobileS: tokensMobileSmall,
};

export const themes = { dark, light };
