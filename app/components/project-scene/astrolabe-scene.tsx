import { Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { AdditiveBlending } from 'three';
import type { Group } from 'three';
import type { SceneProps } from './types';
import { TiltRig } from './tilt-rig';

const GOLD = '#d9a740';
const SUN = '#ffcf6b';

const planets = [
  { radius: 0.78, size: 0.06, speed: 1.1, color: '#d9dce4', phase: 0 },
  { radius: 1.08, size: 0.085, speed: 0.8, color: '#f3e3c3', phase: 2 },
  { radius: 1.38, size: 0.075, speed: 0.6, color: '#e2694a', phase: 4 },
  { radius: 1.72, size: 0.12, speed: 0.4, color: '#d8b48a', phase: 1 },
] as const;

/** A metal armillary hoop spinning on its own axis. */
function Hoop({
  radius,
  tilt,
  axis,
  speed,
}: {
  radius: number;
  tilt: [number, number, number];
  axis: 'x' | 'y' | 'z';
  speed: number;
}) {
  const hoop = useRef<Group>(null!);
  const reduceMotion = useReducedMotion();

  useFrame((_, delta) => {
    if (!reduceMotion) hoop.current.rotation[axis] += delta * speed;
  });

  return (
    <group rotation={tilt}>
      <group ref={hoop}>
        <mesh>
          <torusGeometry args={[radius, 0.03, 16, 128]} />
          <meshPhysicalMaterial color={GOLD} metalness={1} roughness={0.22} clearcoat={0.5} />
        </mesh>
      </group>
    </group>
  );
}

/** The ecliptic: a zodiac dial of twelve marks with the planets on it. */
function Ecliptic() {
  const dial = useRef<Group>(null!);
  const orbits = useRef<Group>(null!);
  const reduceMotion = useReducedMotion();

  useFrame((state, delta) => {
    if (reduceMotion) return;
    dial.current.rotation.z += delta * 0.05;

    orbits.current.children.forEach((child, index) => {
      const planet = planets[index]!;
      const angle = state.clock.elapsedTime * planet.speed * 0.5 + planet.phase;

      child.position.set(Math.cos(angle) * planet.radius, Math.sin(angle) * planet.radius, 0);
    });
  });

  return (
    <group rotation={[-1.15, 0, 0.1]}>
      <group ref={dial}>
        <mesh>
          <ringGeometry args={[2.02, 2.1, 128]} />
          <meshBasicMaterial color={GOLD} transparent opacity={0.8} toneMapped={false} />
        </mesh>
        {Array.from({ length: 12 }, (_, index) => {
          const angle = (index / 12) * Math.PI * 2;

          return (
            <mesh
              key={index}
              position={[Math.cos(angle) * 2.22, Math.sin(angle) * 2.22, 0]}
              rotation={[0, 0, angle]}
            >
              <boxGeometry args={[0.16, 0.025, 0.02]} />
              <meshBasicMaterial color={SUN} toneMapped={false} />
            </mesh>
          );
        })}
        {planets.map(planet => (
          <mesh key={planet.radius}>
            <ringGeometry args={[planet.radius - 0.004, planet.radius + 0.004, 128]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
          </mesh>
        ))}
      </group>
      <group ref={orbits}>
        {planets.map(planet => (
          <mesh
            key={planet.radius}
            position={[
              Math.cos(planet.phase) * planet.radius,
              Math.sin(planet.phase) * planet.radius,
              0,
            ]}
          >
            <sphereGeometry args={[planet.size, 32, 32]} />
            <meshStandardMaterial color={planet.color} roughness={0.5} metalness={0.2} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/**
 * Kundli Predict: an armillary sphere — the sun inside spinning brass hoops,
 * over a zodiac dial with the planets in motion.
 */
export function AstrolabeScene(_props: SceneProps) {
  return (
    <TiltRig rotation={[0.1, 0, 0]} scale={0.7}>
      <Float speed={1} rotationIntensity={0.15} floatIntensity={0.4}>
        <mesh>
          <sphereGeometry args={[0.36, 48, 48]} />
          <meshStandardMaterial color={SUN} emissive={SUN} emissiveIntensity={2.4} toneMapped={false} />
        </mesh>
        <mesh scale={1.9}>
          <sphereGeometry args={[0.36, 32, 32]} />
          <meshBasicMaterial
            color={SUN}
            transparent
            opacity={0.12}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <Hoop radius={1.25} tilt={[0, 0, 0.4]} axis="y" speed={0.5} />
        <Hoop radius={1.5} tilt={[Math.PI / 2, 0, 0]} axis="x" speed={-0.35} />
        <Hoop radius={1.72} tilt={[0.6, 0.8, 0]} axis="z" speed={0.25} />
        <Ecliptic />
      </Float>
    </TiltRig>
  );
}
