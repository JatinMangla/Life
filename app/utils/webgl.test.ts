import { afterEach, describe, expect, it, vi } from 'vitest';
import { isSoftwareRenderer } from './webgl';

const SWIFTSHADER =
  'ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver)';
const GPU = 'ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 (0x00002504) Direct3D11 vs_5_0 ps_5_0, D3D11)';

const UNMASKED_RENDERER_WEBGL = 0x9246;

/** Just enough of a WebGL context for the probe, reporting `renderer`. */
function fakeContext(renderer: string) {
  return {
    VERTEX_SHADER: 0x8b31,
    HIGH_FLOAT: 0x8df2,
    RENDERER: 0x1f01,
    getShaderPrecisionFormat: () => ({ precision: 23, rangeMin: 127, rangeMax: 127 }),
    getParameter: (name: number) =>
      name === UNMASKED_RENDERER_WEBGL ? renderer : 'WebKit WebGL',
    getExtension: (name: string) => {
      if (name === 'WEBGL_debug_renderer_info') return { UNMASKED_RENDERER_WEBGL };
      if (name === 'WEBGL_lose_context') return { loseContext: vi.fn() };
      return null;
    },
  };
}

// The probe caches its answer, so each case needs a fresh copy of the module.
async function probeWith(context: unknown) {
  vi.resetModules();
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    context as RenderingContext
  );
  const { canUseWebGL } = await import('./webgl');

  return canUseWebGL();
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('isSoftwareRenderer', () => {
  it.each([SWIFTSHADER, 'llvmpipe (LLVM 15.0.7, 256 bits)', 'Microsoft Basic Render Driver'])(
    'recognises %s',
    renderer => expect(isSoftwareRenderer(renderer)).toBe(true)
  );

  it('accepts a hardware GPU', () => {
    expect(isSoftwareRenderer(GPU)).toBe(false);
  });
});

describe('canUseWebGL', () => {
  it('starts scenes on a hardware GPU', async () => {
    expect(await probeWith(fakeContext(GPU))).toBe(true);
  });

  it('refuses SwiftShader, which froze /contact on GPU-less CI runners', async () => {
    expect(await probeWith(fakeContext(SWIFTSHADER))).toBe(false);
  });

  it('refuses when no context can be created', async () => {
    expect(await probeWith(null)).toBe(false);
  });
});
