let supported: boolean | undefined;

// CPU rasterisers that browsers fall back to when there is no usable GPU:
// SwiftShader (Chrome), llvmpipe/softpipe (Mesa on Linux), and WARP, which
// Windows reports as the "Microsoft Basic Render Driver".
const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|basic render driver/i;

/** Whether a WebGL renderer string names a software rasteriser. */
export function isSoftwareRenderer(renderer: string): boolean {
  return SOFTWARE_RENDERER.test(renderer);
}

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
 * says no where they would fail. The precision check catches the software
 * rasterisers that hand back a context which then can't compile a shader.
 *
 * Software renderers that do compile are refused too. Chrome's SwiftShader
 * passes both checks above, and on a GPU-less CI runner the contact globe
 * then decoded and drew a 1MB model on the CPU: the page stopped answering
 * and Lighthouse died on /contact with PROTOCOL_TIMEOUT. A visitor without
 * GPU acceleration would get the same frozen tab, for a decoration.
 */
export function canUseWebGL(): boolean {
  if (supported !== undefined) return supported;

  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true }) ??
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true });

    supported =
      !!gl &&
      gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT) !== null &&
      !isSoftwareRenderer(rendererName(gl));

    // Hand the probe's context back straight away; browsers cap live contexts.
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    supported = false;
  }

  return supported;
}

function rendererName(gl: WebGLRenderingContext | WebGL2RenderingContext): string {
  const renderer = String(gl.getParameter(gl.RENDERER) ?? '');

  // Firefox names the real (sanitised) renderer here and logs a deprecation
  // warning for the debug extension, so only ask for the extension when the
  // browser hides the name behind the generic "WebKit WebGL" (Chrome, Safari).
  if (renderer && renderer !== 'WebKit WebGL') return renderer;

  const info = gl.getExtension('WEBGL_debug_renderer_info');

  return info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL) ?? '') : renderer;
}
