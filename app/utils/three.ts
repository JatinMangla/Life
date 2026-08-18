import { Cache, TextureLoader } from 'three';
import type { Light, Material, Mesh, Object3D, Scene, WebGLRenderer } from 'three';
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

/** Dispose of every geometry and material in a scene. */
export const cleanScene = (scene?: Scene | null): void => {
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

/** Dispose of a renderer's GPU resources. */
export const cleanRenderer = (renderer?: WebGLRenderer | null): void => {
  renderer?.dispose();
};

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
