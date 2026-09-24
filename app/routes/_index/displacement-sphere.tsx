import { useTheme } from '~/components/theme-provider';
import { Transition } from '~/components/transition';
import { useReducedMotion, useSpring } from 'framer-motion';
import { useInViewport, useParallax, useWindowSize } from '~/hooks';
import { startTransition, useEffect, useRef } from 'react';
import type { HTMLAttributes } from 'react';
import type { IUniform, Light } from 'three';
import {
  AmbientLight,
  DirectionalLight,
  LinearSRGBColorSpace,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  UniformsUtils,
  Vector2,
  WebGLRenderer,
} from 'three';
import { media } from '~/utils/style';
import { throttle } from '~/utils/throttle';
import { cleanRenderer, cleanScene, removeLights } from '~/utils/three';
import fragmentShader from './displacement-sphere-fragment.glsl?raw';
import vertexShader from './displacement-sphere-vertex.glsl?raw';
import styles from './displacement-sphere.module.css';

const springConfig = {
  stiffness: 30,
  damping: 20,
  mass: 2,
};

export type DisplacementSphereProps = HTMLAttributes<HTMLCanvasElement>;

/** Radians per second around the z axis; per-frame increments spun twice as fast at 120Hz. */
const SPIN_SPEED = 0.06;

/**
 * Sphere resolution. Every vertex runs a multi-octave noise function each
 * frame, so phones and low-core machines get a quarter of the vertices.
 */
function sphereSegments(): number {
  const lowPower =
    window.innerWidth <= media.mobile || (navigator.hardwareConcurrency ?? 8) <= 4;

  return lowPower ? 64 : 128;
}

/** Scroll offset applied to the sphere's height, clamped. */
const sphereLift = (scroll: number) => Math.min(8, Math.max(-4, scroll * 0.5));

export const DisplacementSphere = (props: DisplacementSphereProps) => {
  const { theme } = useTheme();
  const start = useRef(Date.now());
  // Populated in the setup effect before anything reads them, so they're
  // typed non-null rather than null-checking every imperative three.js line.
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef<Vector2>(null!);
  // Null when no WebGL context could be created; every effect checks it.
  const renderer = useRef<WebGLRenderer | null>(null);
  const camera = useRef<PerspectiveCamera>(null!);
  const scene = useRef<Scene>(null!);
  const lights = useRef<Light[]>(null!);
  const uniforms = useRef<Record<string, IUniform>>(null!);
  const material = useRef<MeshPhongMaterial>(null!);
  const geometry = useRef<SphereGeometry>(null!);
  const sphere = useRef<Mesh>(null!);
  const reduceMotion = useReducedMotion();
  const isInViewport = useInViewport(canvasRef);
  const windowSize = useWindowSize();
  const rotationX = useSpring(0, springConfig);
  const rotationY = useSpring(0, springConfig);
  const baseSphereY = useRef(16);

  // Scroll-driven drift: as the user scrolls past the hero, the camera eases
  // in towards the sphere and the sphere dips slightly. Clamped, rAF-batched
  // via useParallax, and skipped entirely for reduced motion.
  const scrollZ = useSpring(0, springConfig);
  useParallax(-0.12, value => scrollZ.set(value * 0.1));

  useEffect(() => {
    const unsubscribe = scrollZ.on('change', v => {
      if (camera.current) camera.current.position.z = 52 + Math.min(14, Math.max(-6, v));
      if (sphere.current) sphere.current.position.y = baseSphereY.current + sphereLift(v);
    });
    return unsubscribe;
  }, [scrollZ]);

  useEffect(() => {
    const { innerWidth, innerHeight } = window;
    mouse.current = new Vector2(0.8, 0.5);

    try {
      renderer.current = new WebGLRenderer({
        canvas: canvasRef.current!,
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: true,
      });
    } catch {
      // No usable WebGL context. The sphere is decoration: leave the canvas
      // empty rather than letting the error take the page down with it.
      return;
    }

    renderer.current.setSize(innerWidth, innerHeight);
    renderer.current.setPixelRatio(1);
    renderer.current.outputColorSpace = LinearSRGBColorSpace;

    camera.current = new PerspectiveCamera(54, innerWidth / innerHeight, 0.1, 100);
    camera.current.position.z = 52;

    scene.current = new Scene();

    material.current = new MeshPhongMaterial();
    material.current.onBeforeCompile = shader => {
      uniforms.current = UniformsUtils.merge([
        shader.uniforms,
        { time: { value: 0 } },
      ]);

      shader.uniforms = uniforms.current;
      shader.vertexShader = vertexShader;
      shader.fragmentShader = fragmentShader;
    };

    startTransition(() => {
      const segments = sphereSegments();
      geometry.current = new SphereGeometry(32, segments, segments);
      sphere.current = new Mesh(geometry.current, material.current);
      sphere.current.position.z = 0;
      scene.current.add(sphere.current);
    });

    return () => {
      cleanScene(scene.current);
      cleanRenderer(renderer.current);
    };
  }, []);

  useEffect(() => {
    if (!renderer.current) return;

    const dirLight = new DirectionalLight(0xffffff, theme === 'light' ? 1.8 : 2.0);
    const ambientLight = new AmbientLight(0xffffff, theme === 'light' ? 2.7 : 0.4);

    dirLight.position.z = 200;
    dirLight.position.x = 100;
    dirLight.position.y = 100;

    lights.current = [dirLight, ambientLight];
    lights.current.forEach(light => scene.current.add(light));

    return () => {
      removeLights(lights.current);
    };
  }, [theme]);

  useEffect(() => {
    const { width, height } = windowSize;

    // useWindowSize reports 0 until it has measured on the client; sizing the
    // renderer from that would set the camera aspect to NaN.
    if (!width || !height || !renderer.current) return;

    const adjustedHeight = height + height * 0.3;
    renderer.current.setSize(width, adjustedHeight);
    camera.current.aspect = width / adjustedHeight;
    camera.current.updateProjectionMatrix();

    if (width <= media.mobile) {
      sphere.current.position.x = 14;
      baseSphereY.current = 10;
    } else if (width <= media.tablet) {
      sphere.current.position.x = 18;
      baseSphereY.current = 14;
    } else {
      sphere.current.position.x = 22;
      baseSphereY.current = 16;
    }
    // Keep the current scroll offset. Resetting to the base position made the
    // sphere jump whenever the window resized partway down the page.
    sphere.current.position.y = baseSphereY.current + sphereLift(scrollZ.get());

    // Not animating, so draw the one frame now: after repositioning, or it
    // shows the old layout until the next resize.
    if (reduceMotion) {
      renderer.current.render(scene.current, camera.current);
    }
  }, [reduceMotion, scrollZ, windowSize]);

  useEffect(() => {
    const onMouseMove = throttle((event: MouseEvent) => {
      const position = {
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,
      };

      rotationX.set(position.y / 2);
      rotationY.set(position.x / 2);
    }, 100);

    if (!reduceMotion && isInViewport) {
      window.addEventListener('mousemove', onMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [isInViewport, reduceMotion, rotationX, rotationY]);

  useEffect(() => {
    const activeRenderer = renderer.current;

    if (!activeRenderer) return;

    let animation: number;
    let lastFrame = performance.now();

    const animate = (now: number = performance.now()) => {
      animation = requestAnimationFrame(animate);

      if (uniforms.current !== undefined) {
        uniforms.current.time!.value = 0.00005 * (Date.now() - start.current);
      }

      // Capped so the first frame after a long pause (a hidden tab) can't lurch.
      const elapsed = Math.min(now - lastFrame, 100) / 1000;
      lastFrame = now;

      sphere.current.rotation.z += SPIN_SPEED * elapsed;
      sphere.current.rotation.x = rotationX.get();
      sphere.current.rotation.y = rotationY.get();

      activeRenderer.render(scene.current, camera.current);
    };

    if (!reduceMotion && isInViewport) {
      animate();
    } else {
      activeRenderer.render(scene.current, camera.current);
    }

    return () => {
      cancelAnimationFrame(animation);
    };
  }, [isInViewport, reduceMotion, rotationX, rotationY]);

  return (
    <Transition in timeout={3000} nodeRef={canvasRef}>
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
