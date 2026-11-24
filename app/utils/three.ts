import { Cache, TextureLoader } from 'three';
import type { Light, Material, Mesh, Object3D, WebGLRenderer } from 'three';
import { DRACOLoader, GLTFLoader } from 'three-stdlib';

// Enable caching for all loaders
Cache.enabled = true;

const dracoLoader = new DRACOLoader();
const gltfLoader = new GLTFLoader();
dracoLoader.setDecoderPath('/draco/');
gltfLoader.setDRACOLoader(dracoLoader);

/** GLTF model loader configured with the Draco decoder. */
export const modelLoader = gltfLoader;
export const textureLoader = new TextureLoader();

function isMesh(object: Object3D): object is Mesh {
  return (object as Mesh).isMesh === true;
}

/** Dispose of every geometry and material in a scene, or any object tree. */
export const cleanScene = (scene?: Object3D | null): void => {
  scene?.traverse(object => {
    if (!isMesh(object)) return;

    object.geometry.dispose();

    if (Array.isArray(object.material)) {
      for (const material of object.material) {
        cleanMaterial(material);
      }
    } else {
      cleanMaterial(object.material);
    }
  });
};

/** Dispose of a material and any textures hanging off it. */
export const cleanMaterial = (material: Material): void => {
  material.dispose();

  for (const key of Object.keys(material)) {
    const value = (material as unknown as Record<string, unknown>)[key];

    if (value && typeof value === 'object' && 'minFilter' in value) {
      const texture = value as unknown as {
        dispose: () => void;
        source?: { data?: { close?: () => void } };
      };

      texture.dispose();

      // GLTF bitmap textures hold onto decoded image data until closed.
      texture.source?.data?.close?.();
    }
  }
};

/**
 * Dispose of a renderer's GPU resources and release its WebGL context.
 *
 * dispose() alone frees buffers but leaves the context alive until garbage
 * collection. Browsers cap live contexts (16 in Chrome) and silently kill the
 * oldest when a page exceeds it, so a few home/project round trips, each
 * mounting the sphere and device models, blanked whichever canvas was on
 * screen.
 */
export const cleanRenderer = (renderer?: WebGLRenderer | null): void => {
  if (!renderer) return;

  renderer.dispose();

  // Only once the canvas has actually left the page. React's StrictMode runs
  // every effect's cleanup and setup twice in development on the *same*
  // canvas, and a context lost here stays lost: the second renderer got it
  // back dead and every scene failed. On a real unmount React has already
  // removed the canvas by the time effect cleanup runs.
  if (!renderer.domElement.isConnected) {
    renderer.forceContextLoss();
  }
};

/**
 * Lets a renderer lose its GPU context without taking the page down, and
 * tells the caller so it can show its static fallback instead.
 *
 * Browsers take contexts back when they run short — iPad Safari does it
 * readily, since it keeps a low cap on live contexts and little GPU memory.
 * A lost context hands back null from every query. three.js's shader-error
 * check then called `gl.getProgramInfoLog(program).trim()` on that null, and
 * the TypeError, thrown from an animation callback, reached the root error
 * page ("An unexpected error occurred") while someone was scrolling. The
 * check only exists to print shader compile errors, so it stays on in
 * development, where those are worth seeing.
 *
 * Losses while the canvas is off the page are our own `cleanRenderer()`
 * releasing it on unmount, not the browser, so they're ignored.
 *
 * Returns a function that stops listening.
 */
export const watchContextLoss = (renderer: WebGLRenderer, onLost: () => void): (() => void) => {
  renderer.debug.checkShaderErrors = import.meta.env.DEV;

  const canvas = renderer.domElement;
  const handleLost = () => {
    if (canvas.isConnected) onLost();
  };

  canvas.addEventListener('webglcontextlost', handleLost);

  return () => canvas.removeEventListener('webglcontextlost', handleLost);
};

/**
 * Whether the renderer's context is gone right now. The `webglcontextlost`
 * event arrives a task later, and three.js only stops drawing once it has;
 * between the two, a draw still runs against the dead context. Hand-written
 * render loops check this first.
 */
export const isContextLost = (renderer?: WebGLRenderer | null): boolean =>
  !renderer || renderer.getContext().isContextLost();

/** Detach lights from their parent so the scene can be garbage collected. */
export const removeLights = (lights?: Light[] | null): void => {
  for (const light of lights ?? []) {
    light.parent?.remove(light);
  }
};

/** Find a descendant by name. */
export const getChild = (name: string, object: Object3D): Object3D | undefined => {
  let node: Object3D | undefined;

  object.traverse(child => {
    if (child.name === name) {
      node = child;
    }
  });

  return node;
};
