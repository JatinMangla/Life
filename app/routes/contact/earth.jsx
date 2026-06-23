import earthModel from '~/assets/earth.glb';
import milkywayBg from '~/assets/milkyway.jpg';
import { Transition } from '~/components/transition';
import { useReducedMotion } from 'framer-motion';
import { useInViewport, useWindowSize } from '~/hooks';
import { startTransition, useEffect, useRef, useState } from 'react';
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
import { media } from '~/utils/style';
import { cleanRenderer, cleanScene, modelLoader, removeLights, textureLoader } from '~/utils/three';
import styles from './earth.module.css';

// Slow ambient spin (radians per frame) — gentle enough to read as "alive"
// without distracting from the contact form floating over it.
const ROTATION_SPEED = 0.0014;

// Pull the camera back on smaller screens so the globe never crowds the card.
const cameraDistance = width => {
  if (width <= media.mobile) return 3.4;
  if (width <= media.tablet) return 3;
  return 2.6;
};

export const ContactEarth = props => {
  const canvasRef = useRef();
  const renderer = useRef();
  const camera = useRef();
  const scene = useRef();
  const lights = useRef();
  const model = useRef();
  const [loaded, setLoaded] = useState(false);
  const reduceMotion = useReducedMotion();
  const isInViewport = useInViewport(canvasRef);
  const windowSize = useWindowSize();

  // Set up renderer, camera, scene, and lights once.
  useEffect(() => {
    const { innerWidth, innerHeight } = window;

    try {
      renderer.current = new WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: true,
      });
    } catch {
      // No usable WebGL context — leave the canvas blank, the page still works.
      return;
    }

    renderer.current.setSize(innerWidth, innerHeight);
    renderer.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.current.outputColorSpace = SRGBColorSpace;
    renderer.current.toneMapping = ACESFilmicToneMapping;

    camera.current = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
    camera.current.position.z = cameraDistance(innerWidth);
    camera.current.lookAt(0, 0, 0);

    scene.current = new Scene();

    const ambientLight = new AmbientLight(0xffffff, 0.6);
    const dirLight = new DirectionalLight(0xffffff, 2.2);
    dirLight.position.set(3, 1.5, 2);
    lights.current = [ambientLight, dirLight];
    lights.current.forEach(light => scene.current.add(light));

    return () => {
      removeLights(lights.current);
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
        if (child.name === 'Atmosphere' && child.material) {
          child.material.alphaMap = child.material.map;
          child.material.transparent = true;
        }
      });
      scene.current.add(model.current);

      setLoaded(true);
    };

    startTransition(() => {
      load();
    });

    return () => {
      mounted = false;
    };
  }, []);

  // Keep the renderer and camera in sync with the viewport size.
  useEffect(() => {
    if (!renderer.current) return;
    const { width, height } = windowSize;
    renderer.current.setSize(width, height);
    camera.current.aspect = width / height;
    camera.current.position.z = cameraDistance(width);
    camera.current.updateProjectionMatrix();
    renderer.current.render(scene.current, camera.current);
  }, [windowSize]);

  // Animation loop — spin while visible, otherwise render a single still frame.
  useEffect(() => {
    if (!renderer.current || !loaded) return;
    let animation;

    const animate = () => {
      animation = requestAnimationFrame(animate);
      if (model.current) model.current.rotation.y += ROTATION_SPEED;
      renderer.current.render(scene.current, camera.current);
    };

    if (!reduceMotion && isInViewport) {
      animate();
    } else {
      renderer.current.render(scene.current, camera.current);
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
