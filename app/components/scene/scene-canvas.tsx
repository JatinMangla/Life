import { Canvas } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import type { ReactNode } from 'react';
import { useInViewport } from '~/hooks';
import { classes } from '~/utils/style';
import { StudioEnvironment } from './studio-environment';
import styles from './scene-canvas.module.css';

export interface SceneCanvasProps {
  children: ReactNode;
  className?: string;
  /** Camera position and vertical field of view. */
  camera?: { position: [number, number, number]; fov?: number };
  /** Called once the renderer exists and the first frame is queued. */
  onReady?: () => void;
  /** Upper bound on device pixel ratio; phones with 3x screens don't need it. */
  maxDpr?: number;
}

/**
 * The React Three Fiber canvas every decorative scene renders into.
 *
 * - Renders only while on screen. `frameloop="never"` off screen means six
 *   project scenes cost nothing while you read one of them.
 * - Reduced motion switches to on-demand rendering: the scene draws its first
 *   frame and stays still.
 * - `failIfMajorPerformanceCaveat` matches `canUseWebGL()`, so a machine that
 *   would render on the CPU never gets a context. Callers still wrap this in a
 *   DecorativeBoundary and check `canUseWebGL()` first.
 *
 * R3F disposes the renderer and forces context loss when the canvas unmounts,
 * which is what `cleanRenderer()` does for the hand-written scenes.
 */
export function SceneCanvas({
  children,
  className,
  camera = { position: [0, 0, 6], fov: 35 },
  onReady,
  maxDpr = 1.75,
}: SceneCanvasProps) {
  const container = useRef<HTMLDivElement>(null);
  const inView = useInViewport(container, false, { rootMargin: '120px 0px' });
  const reduceMotion = useReducedMotion();

  return (
    <div ref={container} className={classes(styles.canvas, className)} aria-hidden>
      <Canvas
        frameloop={reduceMotion ? 'demand' : inView ? 'always' : 'never'}
        dpr={[1, maxDpr]}
        camera={{ position: camera.position, fov: camera.fov ?? 35, near: 0.1, far: 100 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: true,
        }}
        onCreated={() => onReady?.()}
      >
        <StudioEnvironment />
        {children}
      </Canvas>
    </div>
  );
}
