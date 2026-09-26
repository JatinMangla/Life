import { Float, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { MathUtils } from 'three';
import type { Group } from 'three';
import type { SceneProps } from './types';
import { TiltRig } from './tilt-rig';

const COPPER = '#e08a4c';
const GLOW = '#ff9a55';
const STEEL = '#d9dde6';

/** The padlock's shackle. Lifts out of the body while the card is hovered. */
function Shackle({ open }: { open: boolean }) {
  const shackle = useRef<Group>(null!);

  useFrame((_, delta) => {
    const lift = open ? 0.3 : 0;
    const twist = open ? -0.5 : 0;

    shackle.current.position.y = MathUtils.damp(shackle.current.position.y, 0.62 + lift, 6, delta);
    shackle.current.rotation.y = MathUtils.damp(shackle.current.rotation.y, twist, 5, delta);
  });

  const material = (
    <meshPhysicalMaterial color={STEEL} metalness={1} roughness={0.14} clearcoat={1} />
  );

  return (
    // Pivot on the left leg, like a real shackle swinging open.
    <group position={[-0.46, 0, 0]}>
      <group ref={shackle} position={[0, 0.62, 0]}>
        <group position={[0.46, 0, 0]}>
          <mesh position={[0, 0.42, 0]}>
            <torusGeometry args={[0.46, 0.1, 24, 64, Math.PI]} />
            {material}
          </mesh>
          <mesh position={[-0.46, 0.21, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.42, 24]} />
            {material}
          </mesh>
          <mesh position={[0.46, 0.21, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.42, 24]} />
            {material}
          </mesh>
        </group>
      </group>
    </group>
  );
}

/** Encrypted blocks circling the lock. */
function DataRing() {
  const ring = useRef<Group>(null!);
  const reduceMotion = useReducedMotion();
  const count = 16;

  useFrame((_, delta) => {
    if (!reduceMotion) ring.current.rotation.y += delta * 0.35;
  });

  return (
    <group rotation={[0.35, 0, -0.18]}>
      <group ref={ring}>
        {Array.from({ length: count }, (_, index) => {
          const angle = (index / count) * Math.PI * 2;
          const glowing = index % 3 === 0;
          const size = glowing ? 0.13 : 0.1;

          return (
            <mesh
              key={index}
              position={[Math.cos(angle) * 1.85, Math.sin(index * 1.7) * 0.12, Math.sin(angle) * 1.85]}
              rotation={[angle, angle * 2, 0]}
            >
              <boxGeometry args={[size, size, size]} />
              {glowing ? (
                <meshStandardMaterial
                  color={GLOW}
                  emissive={GLOW}
                  emissiveIntensity={2.2}
                  toneMapped={false}
                />
              ) : (
                <meshPhysicalMaterial color="#8a93a8" metalness={0.9} roughness={0.22} />
              )}
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

/**
 * Personal Vault: a copper padlock inside a ring of encrypted blocks.
 * Hovering the card unlocks it.
 */
export function VaultScene({ active }: SceneProps) {
  return (
    <TiltRig rotation={[0.1, -0.35, 0]} scale={0.95} position={[0, -0.15, 0]}>
      <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.6}>
        <RoundedBox args={[1.7, 1.3, 0.62]} radius={0.16} smoothness={6}>
          <meshPhysicalMaterial
            color={COPPER}
            metalness={1}
            roughness={0.26}
            clearcoat={0.6}
            clearcoatRoughness={0.2}
          />
        </RoundedBox>
        {/* Keyhole */}
        <group position={[0, -0.02, 0.315]}>
          <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.02, 32]} />
            <meshStandardMaterial color="#0c0d12" roughness={0.6} />
          </mesh>
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[0.09, 0.3, 0.02]} />
            <meshStandardMaterial color="#0c0d12" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.02, 0.005]}>
            <torusGeometry args={[0.26, 0.012, 12, 64]} />
            <meshStandardMaterial
              color={GLOW}
              emissive={GLOW}
              emissiveIntensity={active ? 3 : 1.4}
              toneMapped={false}
            />
          </mesh>
        </group>
        <Shackle open={!!active} />
      </Float>
      <DataRing />
    </TiltRig>
  );
}
