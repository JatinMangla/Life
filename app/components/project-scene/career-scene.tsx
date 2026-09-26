import { Float, RoundedBox, Trail } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import { useMemo, useRef } from 'react';
import { BufferGeometry, DoubleSide, Float32BufferAttribute, Vector3 } from 'three';
import type { Group } from 'three';
import type { SceneProps } from './types';
import { TiltRig } from './tilt-rig';

const VIOLET = '#b58cff';
const MINT = '#5ee2a8';

/** A folded paper plane: two wings and a keel, nose along +z. */
function usePaperPlane() {
  return useMemo(() => {
    const nose = [0, 0, 0.55];
    const leftTip = [-0.42, 0.04, -0.3];
    const rightTip = [0.42, 0.04, -0.3];
    const tail = [0, 0, -0.24];
    const keel = [0, -0.14, -0.26];
    const geometry = new BufferGeometry();

    geometry.setAttribute(
      'position',
      new Float32BufferAttribute(
        [
          ...nose, ...leftTip, ...tail,
          ...nose, ...tail, ...rightTip,
          ...nose, ...tail, ...keel,
          ...nose, ...keel, ...tail,
        ],
        3
      )
    );
    geometry.computeVertexNormals();

    return geometry;
  }, []);
}

/** The plane loops a figure-eight through the cards, trailing light. */
function Plane() {
  const plane = useRef<Group>(null!);
  const geometry = usePaperPlane();
  const reduceMotion = useReducedMotion();
  const ahead = useMemo(() => new Vector3(), []);

  const pathAt = (time: number, target: Vector3) =>
    target.set(Math.sin(time) * 1.5, Math.sin(time * 2) * 0.4 + 0.1, Math.cos(time) * 0.9);

  useFrame(state => {
    const time = reduceMotion ? 0.6 : state.clock.elapsedTime * 0.55;

    pathAt(time, plane.current.position);
    plane.current.lookAt(pathAt(time + 0.05, ahead));
    // Bank into the turns.
    plane.current.rotateZ(Math.cos(time) * -0.6);
  });

  return (
    <Trail width={1.6} length={6} color={VIOLET} attenuation={width => width} decay={1}>
      <group ref={plane}>
        <mesh geometry={geometry}>
          <meshStandardMaterial color="#f4f1ff" roughness={0.55} side={DoubleSide} flatShading />
        </mesh>
      </group>
    </Trail>
  );
}

interface CardProps {
  position: [number, number, number];
  rotation: [number, number, number];
  applied?: boolean;
}

/** A job posting: a glassy card with placeholder text bars. */
function JobCard({ position, rotation, applied }: CardProps) {
  return (
    <Float speed={1.3} rotationIntensity={0.35} floatIntensity={0.7}>
      <group position={position} rotation={rotation}>
        <RoundedBox args={[1.05, 0.66, 0.04]} radius={0.06} smoothness={4}>
          <meshPhysicalMaterial
            color="#3a3160"
            metalness={0.35}
            roughness={0.3}
            clearcoat={1}
            transparent
            opacity={0.92}
          />
        </RoundedBox>
        {/* Company mark and text lines. */}
        <mesh position={[-0.36, 0.18, 0.025]}>
          <circleGeometry args={[0.08, 24]} />
          <meshBasicMaterial color={VIOLET} toneMapped={false} />
        </mesh>
        {[0.2, 0.06, -0.08].map((y, index) => (
          <mesh key={y} position={[index === 0 ? 0.02 : -0.08, y, 0.025]}>
            <planeGeometry args={[index === 0 ? 0.5 : 0.7, 0.045]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={index === 0 ? 0.8 : 0.3} />
          </mesh>
        ))}
        <mesh position={[0.3, -0.2, 0.025]}>
          <planeGeometry args={[0.3, 0.1]} />
          <meshBasicMaterial color={applied ? MINT : VIOLET} transparent opacity={0.9} toneMapped={false} />
        </mesh>
      </group>
    </Float>
  );
}

/**
 * CareerPilot AI: a paper plane looping through a scatter of job cards —
 * finding postings and sending applications.
 */
export function CareerScene(_props: SceneProps) {
  return (
    <TiltRig rotation={[0.05, 0, 0]} scale={0.8}>
      <JobCard position={[-1.3, 0.75, -0.6]} rotation={[0, 0.35, 0.05]} />
      <JobCard position={[1.25, 0.55, -0.9]} rotation={[0, -0.4, -0.04]} applied />
      <JobCard position={[-0.95, -0.8, -0.2]} rotation={[0, 0.25, -0.06]} applied />
      <JobCard position={[1.35, -0.75, 0.1]} rotation={[0, -0.3, 0.05]} />
      <Plane />
    </TiltRig>
  );
}
