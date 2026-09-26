import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import {
  BackSide,
  BoxGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  PMREMGenerator,
  PlaneGeometry,
  Scene,
} from 'three';

/**
 * Reflections for the metallic and glossy materials, built from a tiny scene
 * of coloured light panels instead of an HDR photo.
 *
 * drei's <Environment> presets download their HDRs from a third-party CDN,
 * which the CSP rightly blocks, and a local HDR would add ~1MB. A dark room
 * with a white softbox and the site's cyan and violet panels is a few
 * hundred bytes of code, and it's why every object's rim light matches the
 * page's aurora.
 */
export function StudioEnvironment() {
  const gl = useThree(state => state.gl);
  const scene = useThree(state => state.scene);

  useEffect(() => {
    const room = new Scene();
    const geometries: (BoxGeometry | PlaneGeometry)[] = [];
    const materials: MeshBasicMaterial[] = [];

    const roomGeometry = new BoxGeometry(20, 20, 20);
    // Mid-dark rather than black: metal reflects its surroundings, and in a
    // black room every metallic surface rendered as a silhouette.
    const roomMaterial = new MeshBasicMaterial({ color: new Color('#262c40'), side: BackSide });
    geometries.push(roomGeometry);
    materials.push(roomMaterial);
    room.add(new Mesh(roomGeometry, roomMaterial));

    const panels: {
      color: string;
      intensity: number;
      size: [number, number];
      position: [number, number, number];
    }[] = [
      // Key softbox overhead, slightly in front.
      { color: '#ffffff', intensity: 4, size: [12, 5], position: [0, 9, 3] },
      // Cool rim from the left, violet from the right.
      { color: '#39d7ff', intensity: 2.4, size: [3, 12], position: [-9, 1, 0] },
      { color: '#9b6bff', intensity: 2.4, size: [3, 12], position: [9, 1, -1] },
      // Front fill and a floor bounce so faces toward the camera and
      // undersides pick up light instead of going black.
      { color: '#ffffff', intensity: 1.6, size: [10, 4], position: [0, 1, 9] },
      { color: '#c9d4ff', intensity: 0.8, size: [14, 6], position: [0, -9, 2] },
      // A warm strip behind, for a second highlight on curved metal.
      { color: '#ffd9b0', intensity: 1.2, size: [8, 2], position: [2, 4, -9] },
    ];

    for (const panel of panels) {
      const geometry = new PlaneGeometry(...panel.size);
      const material = new MeshBasicMaterial({
        color: new Color(panel.color).multiplyScalar(panel.intensity),
      });
      const mesh = new Mesh(geometry, material);

      mesh.position.set(...panel.position);
      mesh.lookAt(0, 0, 0);
      geometries.push(geometry);
      materials.push(material);
      room.add(mesh);
    }

    const pmrem = new PMREMGenerator(gl);
    const target = pmrem.fromScene(room, 0.04);

    scene.environment = target.texture;

    return () => {
      scene.environment = null;
      target.dispose();
      pmrem.dispose();
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
    };
  }, [gl, scene]);

  return null;
}
