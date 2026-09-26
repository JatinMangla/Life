import { Float, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import { useMemo, useRef } from 'react';
import { QuadraticBezierCurve3, TubeGeometry, Vector3 } from 'three';
import type { Group, Mesh } from 'three';
import type { SceneProps } from './types';
import { TiltRig } from './tilt-rig';

const BLUE = '#7d9bff';
const WARM = '#ff9d73';
const LINK = '#9fb4ff';

const CLIENT = new Vector3(-1.75, 0.45, -0.1);
const SERVER = new Vector3(0, -0.15, 0.25);
const API = new Vector3(1.75, 0.5, -0.2);

function arc(from: Vector3, to: Vector3, lift: number) {
  const middle = from.clone().lerp(to, 0.5).add(new Vector3(0, lift, 0.35));

  return new QuadraticBezierCurve3(from, middle, to);
}

interface LinkProps {
  curve: QuadraticBezierCurve3;
  /** Seconds for one pulse to cross; the reply travels back at the same speed. */
  period: number;
  offset?: number;
  color: string;
}

/** A glowing wire with a request pulse going out and a response coming back. */
function Link({ curve, period, offset = 0, color }: LinkProps) {
  const request = useRef<Mesh>(null!);
  const response = useRef<Mesh>(null!);
  const reduceMotion = useReducedMotion();
  const geometry = useMemo(() => new TubeGeometry(curve, 64, 0.012, 8, false), [curve]);

  useFrame(state => {
    const time = reduceMotion ? 0.3 : (state.clock.elapsedTime / period + offset) % 1;

    request.current.position.copy(curve.getPoint(time));
    response.current.position.copy(curve.getPoint(1 - ((time + 0.5) % 1)));
  });

  return (
    <group>
      <mesh geometry={geometry}>
        <meshBasicMaterial color={LINK} transparent opacity={0.45} toneMapped={false} />
      </mesh>
      <mesh ref={request}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh ref={response}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
    </group>
  );
}

/** The server's tools, orbiting it inside the OAuth ring. */
function Tools() {
  const orbit = useRef<Group>(null!);
  const gate = useRef<Mesh>(null!);
  const reduceMotion = useReducedMotion();
  const count = 6;

  useFrame((_, delta) => {
    if (reduceMotion) return;
    orbit.current.rotation.y += delta * 0.6;
    gate.current.rotation.z -= delta * 0.25;
  });

  return (
    <group position={SERVER}>
      {/* A hexagonal ring stands in for the authorization gate. */}
      <mesh ref={gate} rotation={[0.9, 0.2, 0]}>
        <torusGeometry args={[0.95, 0.018, 8, 6]} />
        <meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={1.8} toneMapped={false} />
      </mesh>
      <group ref={orbit} rotation={[0.3, 0, 0.15]}>
        {Array.from({ length: count }, (_, index) => {
          const angle = (index / count) * Math.PI * 2;

          return (
            <mesh
              key={index}
              position={[Math.cos(angle) * 0.72, Math.sin(angle * 2) * 0.08, Math.sin(angle) * 0.72]}
              scale={0.07}
            >
              <octahedronGeometry args={[1, 0]} />
              <meshPhysicalMaterial color="#e8ecff" metalness={0.8} roughness={0.15} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

/**
 * Analytics MCP Server: a client, the MCP server and the upstream API as
 * three nodes, with requests and responses pulsing along the links.
 */
export function NetworkScene(_props: SceneProps) {
  const curves = useMemo(() => [arc(CLIENT, SERVER, 0.35), arc(SERVER, API, 0.4)], []);

  return (
    <TiltRig rotation={[0.15, 0, 0]} scale={0.78}>
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
        {/* Client — the assistant asking the questions. */}
        <mesh position={CLIENT}>
          <sphereGeometry args={[0.32, 48, 48]} />
          <meshPhysicalMaterial
            color={WARM}
            emissive={WARM}
            emissiveIntensity={0.35}
            metalness={0.3}
            roughness={0.25}
            clearcoat={1}
          />
        </mesh>
        {/* The MCP server: faceted core with a wireframe shell. */}
        <group position={SERVER}>
          <mesh>
            <icosahedronGeometry args={[0.44, 0]} />
            <meshPhysicalMaterial color={BLUE} metalness={0.85} roughness={0.2} flatShading clearcoat={1} />
          </mesh>
          <mesh scale={1.3}>
            <icosahedronGeometry args={[0.44, 1]} />
            <meshBasicMaterial color={LINK} wireframe transparent opacity={0.25} toneMapped={false} />
          </mesh>
        </group>
        {/* The upstream API. */}
        <RoundedBox args={[0.62, 0.62, 0.62]} radius={0.1} smoothness={4} position={API} rotation={[0.4, 0.6, 0]}>
          <meshPhysicalMaterial color="#c7cedf" metalness={1} roughness={0.2} clearcoat={0.8} />
        </RoundedBox>
        <Link curve={curves[0]!} period={2.4} color={WARM} />
        <Link curve={curves[1]!} period={2.4} offset={0.35} color={BLUE} />
        <Tools />
      </Float>
    </TiltRig>
  );
}
