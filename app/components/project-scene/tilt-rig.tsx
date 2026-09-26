import { useFrame } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import type { ReactNode } from 'react';
import { MathUtils } from 'three';
import type { Group } from 'three';
import { usePointer } from '~/components/scene';

export interface TiltRigProps {
  children: ReactNode;
  /** How far, in radians, the rig leans toward the cursor. */
  strength?: number;
  /** Resting rotation, so each object can show its best side. */
  rotation?: [number, number, number];
  scale?: number;
  position?: [number, number, number];
}

/**
 * Leans its children toward the cursor and sways gently when idle. Shared by
 * every project scene so they all respond to the pointer the same way.
 */
export function TiltRig({
  children,
  strength = 0.35,
  rotation = [0, 0, 0],
  scale = 1,
  position = [0, 0, 0],
}: TiltRigProps) {
  const rig = useRef<Group>(null!);
  const pointer = usePointer();
  const reduceMotion = useReducedMotion();

  useFrame((state, delta) => {
    if (reduceMotion) return;

    const time = state.clock.elapsedTime;
    const targetX = rotation[0] - pointer.current.y * strength * 0.6 + Math.sin(time * 0.6) * 0.04;
    const targetY = rotation[1] + pointer.current.x * strength + Math.sin(time * 0.4) * 0.08;

    rig.current.rotation.x = MathUtils.damp(rig.current.rotation.x, targetX, 3, delta);
    rig.current.rotation.y = MathUtils.damp(rig.current.rotation.y, targetY, 3, delta);
  });

  return (
    <group ref={rig} rotation={rotation} scale={scale} position={position}>
      {children}
    </group>
  );
}
