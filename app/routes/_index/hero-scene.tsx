import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { MathUtils } from 'three';
import type { Group, Mesh } from 'three';
import { SceneCanvas, usePointer } from '~/components/scene';
import type { ThemeId } from '~/components/theme-provider';

interface RingProps {
  radius: number;
  color: string;
  tilt: [number, number, number];
  speed: number;
  satellites: number;
  opacity?: number;
}

/** A hairline ring of light with small moons riding it. */
function Ring({ radius, color, tilt, speed, satellites, opacity = 0.9 }: RingProps) {
  const spinner = useRef<Group>(null!);
  const reduceMotion = useReducedMotion();

  useFrame((_, delta) => {
    if (!reduceMotion) spinner.current.rotation.z += delta * speed;
  });

  return (
    <group rotation={tilt}>
      <group ref={spinner}>
        <mesh>
          <torusGeometry args={[radius, 0.008, 12, 180]} />
          <meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
        </mesh>
        {Array.from({ length: satellites }, (_, index) => {
          const angle = (index / satellites) * Math.PI * 2;

          return (
            <mesh
              key={index}
              position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
            >
              <sphereGeometry args={[index === 0 ? 0.07 : 0.04, 24, 24]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={2}
                toneMapped={false}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

/** Small glossy solids hanging around the core, for depth. */
function Debris({ theme }: { theme: ThemeId }) {
  const pieces: { position: [number, number, number]; scale: number; shape: 'box' | 'oct' }[] = [
    { position: [-1.5, 2.1, -1.2], scale: 0.2, shape: 'box' },
    { position: [2.1, -1.4, 0.4], scale: 0.18, shape: 'oct' },
    { position: [1.6, 1.7, -1.2], scale: 0.14, shape: 'box' },
    { position: [-1.2, -2, 0.6], scale: 0.16, shape: 'oct' },
    { position: [0.2, 2.3, 0.3], scale: 0.1, shape: 'oct' },
  ];

  return (
    <>
      {pieces.map(({ position, scale, shape }, index) => (
        <Float key={index} speed={1.4 + index * 0.3} rotationIntensity={1.6} floatIntensity={1.2}>
          <mesh position={position} scale={scale}>
            {shape === 'box' ? <boxGeometry args={[1, 1, 1]} /> : <octahedronGeometry args={[1, 0]} />}
            <meshPhysicalMaterial
              color={theme === 'light' ? '#e9ecf5' : '#7c86a8'}
              metalness={0.9}
              roughness={0.18}
              clearcoat={1}
              envMapIntensity={1.4}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function HeroObject({ theme }: { theme: ThemeId }) {
  const rig = useRef<Group>(null!);
  const core = useRef<Mesh>(null!);
  const pointer = usePointer();
  const reduceMotion = useReducedMotion();
  const viewport = useThree(state => state.viewport);
  const size = useThree(state => state.size);
  const isNarrow = size.width < 820;

  // Beside the headline on wide screens. On phones the canvas is a band of
  // its own above the copy, so the object just fills it.
  const baseX = isNarrow ? 0 : viewport.width * 0.2;
  const baseY = 0;
  const baseScale = isNarrow ? Math.min(0.72, viewport.height / 6.4) : Math.min(1, viewport.width / 11);

  useFrame((state, delta) => {
    const scroll = typeof window === 'undefined' ? 0 : window.scrollY / window.innerHeight;
    const targetX = reduceMotion ? 0 : pointer.current.y * -0.25 + scroll * 0.6;
    const targetY = reduceMotion ? 0 : pointer.current.x * 0.35;

    rig.current.rotation.x = MathUtils.damp(rig.current.rotation.x, targetX, 3, delta);
    rig.current.rotation.y = MathUtils.damp(rig.current.rotation.y, targetY, 3, delta);
    // Rises and recedes as the hero scrolls away.
    rig.current.position.y = MathUtils.damp(rig.current.position.y, baseY + scroll * 1.6, 4, delta);
    rig.current.position.x = MathUtils.damp(rig.current.position.x, baseX, 4, delta);

    const scale = MathUtils.damp(rig.current.scale.x, baseScale, 2.5, delta);
    rig.current.scale.setScalar(scale);

    if (!reduceMotion) core.current.rotation.y += delta * 0.15;
    core.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
  });

  const isLight = theme === 'light';

  return (
    <group ref={rig} scale={0.5}>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.15, 24]} />
        <MeshDistortMaterial
          color={isLight ? '#d5dcf0' : '#4a5aa0'}
          distort={0.4}
          speed={reduceMotion ? 0 : 1.6}
          metalness={0.9}
          roughness={0.12}
          clearcoat={1}
          clearcoatRoughness={0.1}
          iridescence={1}
          iridescenceIOR={1.35}
          iridescenceThicknessRange={[120, 900]}
          envMapIntensity={isLight ? 1.1 : 1.5}
        />
      </mesh>
      <Ring
        radius={1.75}
        color={isLight ? '#0891b2' : '#5ce1ff'}
        tilt={[1.2, 0.2, 0]}
        speed={0.35}
        satellites={2}
      />
      <Ring
        radius={2.2}
        color={isLight ? '#7c3aed' : '#a98bff'}
        tilt={[1.75, -0.5, 0.3]}
        speed={-0.22}
        satellites={3}
        opacity={0.7}
      />
      <Ring
        radius={2.7}
        color={isLight ? '#334155' : '#ffffff'}
        tilt={[1.4, 0.6, -0.2]}
        speed={0.12}
        satellites={1}
        opacity={0.35}
      />
      <Debris theme={theme} />
      <Sparkles
        count={isNarrow ? 40 : 80}
        scale={[7, 5, 4]}
        size={2.2}
        speed={reduceMotion ? 0 : 0.35}
        opacity={isLight ? 0.5 : 0.8}
        color={isLight ? '#475569' : '#bfefff'}
      />
    </group>
  );
}

export interface HeroSceneProps {
  theme: ThemeId;
  className?: string;
  onReady?: () => void;
}

export function HeroScene({ theme, className, onReady }: HeroSceneProps) {
  return (
    <SceneCanvas className={className} camera={{ position: [0, 0, 7], fov: 38 }} onReady={onReady}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />
      <HeroObject theme={theme} />
    </SceneCanvas>
  );
}
