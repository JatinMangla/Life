// Vite resolves these to URL strings at build time. `assetsInclude` in
// vite.config.js covers the non-standard ones (glb/hdr/glsl).
declare module '*.glb' {
  const src: string;
  export default src;
}

declare module '*.hdr' {
  const src: string;
  export default src;
}

declare module '*.glsl' {
  const src: string;
  export default src;
}

declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.svg' {
  const src: string;
  export default src;
}
