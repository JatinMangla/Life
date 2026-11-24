import earthModel from '~/assets/earth.glb';
import milkywayBg from '~/assets/milkyway.jpg';
import { Transition } from '~/components/transition';
import { useReducedMotion } from 'framer-motion';
import { useInViewport, useWindowSize } from '~/hooks';
import { startTransition, useEffect, useRef, useState } from 'react';
import type { HTMLAttributes } from 'react';
import {
  ACESFilmicToneMapping,
  AmbientLight,
  DirectionalLight,
  EquirectangularReflectionMapping,
  PerspectiveCamera,
  SRGBColorSpace,
  Scene,
  WebGLRenderer,
} from 'three';
import type { BufferGeometry, Group, Light, Mesh, MeshStandardMaterial } from 'three';
import { media } from '~/utils/style';
import {
  cleanRenderer,
  cleanScene,
  isContextLost,
  modelLoader,
  removeLights,
  textureLoader,
  watchContextLoss,
} from '~/utils/three';
import styles from './earth.module.css';

// Slow ambient spin in radians per second — gentle enough to read as "alive"
// without distracting from the contact form beside it. Per second rather than
// per frame, which spun twice as fast on a 120Hz display.
const ROTATION_SPEED = 0.084;

// How far back the camera sits — larger value = smaller globe within its box.
// Beside the form the globe is meant to overflow its box: the section clips
// its right half. Stacked under the form (tablets and phones) it's shown
// whole in a square, and at 2.3 it was wider than the square, so the canvas
// edges cut it into an octagon.
const CAMERA_DISTANCE = 2.3;
const CAMERA_DISTANCE_STACKED = 3;

const cameraDistance = () =>
  window.innerWidth <= media.tablet ? CAMERA_DISTANCE_STACKED : CAMERA_DISTANCE;

export type ContactEarthProps = HTMLAttributes<HTMLCanvasElement>;

export const ContactEarth = (props: ContactEarthProps) => {
  // Assigned in the setup effect below; every read is guarded by the
  // `if (!renderer.current) return` checks in the effects that follow.
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<WebGLRenderer>(null!);
  const camera = useRef<PerspectiveCamera>(null!);
  const scene = useRef<Scene>(null!);
  const lights = useRef<Light[]>(null!);
  const model = useRef<Group>(null!);
  const [loaded, setLoaded] = useState(false);
  const reduceMotion = useReducedMotion();
  const isInViewport = useInViewport(canvasRef);
  const windowSize = useWindowSize();

  // Measure the canvas's own (CSS-driven) box so the globe sizes to its column.
  const getSize = () => {
    const el = canvasRef.current;
    return { width: el?.clientWidth || 1, height: el?.clientHeight || 1 };
  };

  // Every draw goes through here: the context can be lost between frames,
  // and three.js only notices a task later.
  const draw = () => {
    if (!isContextLost(renderer.current)) renderer.current.render(scene.current, camera.current);
  };

  // Set up renderer, camera, scene, and lights once.
  useEffect(() => {
    const { width, height } = getSize();

    try {
      renderer.current = new WebGLRenderer({
        canvas: canvasRef.current!,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: true,
      });
    } catch {
      // No usable WebGL context — leave the canvas blank, the page still works.
      return;
    }

    renderer.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // updateStyle = false: CSS controls the display size, we only set the buffer.
    renderer.current.setSize(width, height, false);
    renderer.current.outputColorSpace = SRGBColorSpace;
    renderer.current.toneMapping = ACESFilmicToneMapping;
    // A lost context fades the globe out rather than breaking the page.
    const stopWatchingContext = watchContextLoss(renderer.current, () => setLoaded(false));

    camera.current = new PerspectiveCamera(45, width / height, 0.1, 100);
    camera.current.position.z = cameraDistance();
    camera.current.lookAt(0, 0, 0);

    scene.current = new Scene();

    const ambientLight = new AmbientLight(0xffffff, 0.6);
    const dirLight = new DirectionalLight(0xffffff, 2.2);
    dirLight.position.set(3, 1.5, 2);
    lights.current = [ambientLight, dirLight];
    lights.current.forEach(light => scene.current.add(light));

    return () => {
      stopWatchingContext();
      removeLights(lights.current);
      // The environment map isn't attached to any mesh, so cleanScene's
      // traversal never reaches it.
      scene.current.environment?.dispose();
      cleanScene(scene.current);
      cleanRenderer(renderer.current);
    };
  }, []);

  // Load the globe model and a starfield environment for soft reflections.
  useEffect(() => {
    if (!renderer.current) return;
    let mounted = true;

    const load = async () => {
      const [gltf, envTexture] = await Promise.all([
        modelLoader.loadAsync(earthModel),
        textureLoader.loadAsync(milkywayBg),
      ]);

      if (!mounted) return;

      envTexture.mapping = EquirectangularReflectionMapping;
      envTexture.colorSpace = SRGBColorSpace;
      scene.current.environment = envTexture;

      model.current = gltf.scene;
      model.current.traverse(child => {
        // The atmosphere shell reads its glow from its own colour map.
        if (child.name !== 'Atmosphere') return;

        const mesh = child as Mesh<BufferGeometry, MeshStandardMaterial>;

        if (!mesh.material) return;

        mesh.material.alphaMap = mesh.material.map;
        mesh.material.transparent = true;
      });
      scene.current.add(model.current);

      setLoaded(true);
    };

    startTransition(() => {
      // A failed download just leaves the globe out; it's decoration.
      load().catch(error => console.warn('[earth] globe failed to load:', error));
    });

    return () => {
      mounted = false;
    };
  }, []);

  // Keep the renderer and camera in sync with the container size on resize.
  useEffect(() => {
    if (!renderer.current) return;
    const { width, height } = getSize();
    renderer.current.setSize(width, height, false);
    camera.current.aspect = width / height;
    camera.current.position.z = cameraDistance();
    camera.current.updateProjectionMatrix();
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowSize]);

  // Animation loop — spin while visible, otherwise render a single still frame.
  useEffect(() => {
    if (!renderer.current || !loaded) return;
    let animation: number;
    let lastFrame = performance.now();

    const animate = (now: number = performance.now()) => {
      animation = requestAnimationFrame(animate);
      // Capped so the first frame after a hidden tab can't lurch.
      const elapsed = Math.min(now - lastFrame, 100) / 1000;
      lastFrame = now;
      if (model.current) model.current.rotation.y += ROTATION_SPEED * elapsed;
      draw();
    };

    if (!reduceMotion && isInViewport) {
      animate();
    } else {
      draw();
    }

    return () => cancelAnimationFrame(animation);
  }, [loaded, reduceMotion, isInViewport]);

  return (
    <Transition in={loaded} timeout={3000} nodeRef={canvasRef}>
      {({ visible, nodeRef }) => (
        <canvas
          aria-hidden
          className={styles.canvas}
          data-visible={visible}
          ref={nodeRef}
          {...props}
        />
      )}
    </Transition>
  );
};
