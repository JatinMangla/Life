let supported: boolean | undefined;

/**
 * Whether this browser can run the site's WebGL scenes, probed once.
 *
 * DecorativeBoundary already stops a failing scene from breaking the page,
 * but a failure still logs errors: three.js reports the context it couldn't
 * create, and React reports the error the boundary caught. On machines with
 * no GPU — including every CI runner, where Lighthouse marks console errors
 * against Best Practices — it's better not to start the scene at all.
 *
 * `failIfMajorPerformanceCaveat` matches what the renderers ask for, so this
 * says no exactly where they would fail. The precision check catches the
 * software rasterisers that hand back a context which then can't compile a
 * shader.
 */
export function canUseWebGL(): boolean {
  if (supported !== undefined) return supported;

  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true }) ??
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true });

    supported = !!gl && gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT) !== null;

    // Hand the probe's context back straight away; browsers cap live contexts.
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    supported = false;
  }

  return supported;
}
