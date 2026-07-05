// 3D farm visualization — React Three Fiber.
// The farm reacts to live data: crop growth scales with recommendation score,
// rain particles activate from the real forecast, sky shifts with alert level.
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { AlertLevel } from "../lib/api";

interface FarmProps {
  growth: number;      // 0..1 — crop maturity/health
  rainLevel: number;   // 0..1 — forecast rain intensity
  alertLevel: AlertLevel;
}

const SKY: Record<AlertLevel, string> = {
  green: "#0e2233",
  amber: "#2a2114",
  red: "#2b1412",
};

const ROWS = 8;
const COLS = 14;
const SPACING = 1.1;

function Crops({ growth }: { growth: number }) {
  const stemRef = useRef<THREE.InstancedMesh>(null);
  const leafRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: ROWS * COLS }, (_, i) => ({
        x: (i % COLS) * SPACING - (COLS * SPACING) / 2,
        z: Math.floor(i / COLS) * SPACING - (ROWS * SPACING) / 2,
        jitter: Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2,
      })),
    [],
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    seeds.forEach((s, i) => {
      const h = 0.25 + growth * (0.9 + s.jitter);
      const sway = Math.sin(t * 1.4 + s.phase) * 0.06;

      dummy.position.set(s.x, h / 2, s.z);
      dummy.rotation.set(sway, 0, sway * 0.7);
      dummy.scale.set(1, h, 1);
      dummy.updateMatrix();
      stemRef.current?.setMatrixAt(i, dummy.matrix);

      dummy.position.set(s.x + sway * h, h + 0.08, s.z);
      dummy.rotation.set(0, s.phase, 0);
      const leaf = 0.12 + growth * 0.22;
      dummy.scale.set(leaf, leaf, leaf);
      dummy.updateMatrix();
      leafRef.current?.setMatrixAt(i, dummy.matrix);
    });
    if (stemRef.current) stemRef.current.instanceMatrix.needsUpdate = true;
    if (leafRef.current) leafRef.current.instanceMatrix.needsUpdate = true;
  });

  const healthColor = new THREE.Color().lerpColors(
    new THREE.Color("#8a7a2f"),
    new THREE.Color("#3f9d4e"),
    growth,
  );

  return (
    <group>
      <instancedMesh ref={stemRef} args={[undefined, undefined, ROWS * COLS]}>
        <cylinderGeometry args={[0.03, 0.05, 1, 5]} />
        <meshStandardMaterial color="#5d8a3a" />
      </instancedMesh>
      <instancedMesh ref={leafRef} args={[undefined, undefined, ROWS * COLS]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={healthColor} flatShading />
      </instancedMesh>
    </group>
  );
}

const RAIN_COUNT = 900;

function Rain({ intensity }: { intensity: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(RAIN_COUNT * 3);
    for (let i = 0; i < RAIN_COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 22;
      arr[i * 3 + 1] = Math.random() * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 22;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current || intensity <= 0.02) return;
    const pos = ref.current.geometry.attributes.position;
    for (let i = 0; i < RAIN_COUNT; i++) {
      let y = pos.getY(i) - delta * (6 + intensity * 8);
      if (y < 0) y = 12;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  });

  if (intensity <= 0.02) return null;
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#9ec5f4"
        size={0.06}
        transparent
        opacity={Math.min(0.35 + intensity * 0.5, 0.85)}
      />
    </points>
  );
}

function Ground() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#2b2418" />
      </mesh>
      {/* furrow strips */}
      {Array.from({ length: ROWS }, (_, r) => (
        <mesh
          key={r}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.005, r * SPACING - (ROWS * SPACING) / 2]}
        >
          <planeGeometry args={[COLS * SPACING + 1, 0.55]} />
          <meshStandardMaterial color="#3a3122" />
        </mesh>
      ))}
    </group>
  );
}

function Sun({ alertLevel }: { alertLevel: AlertLevel }) {
  const color = alertLevel === "red" ? "#ff8a5c" : alertLevel === "amber" ? "#ffd27a" : "#fff3c4";
  return (
    <mesh position={[10, 9, -12]}>
      <sphereGeometry args={[1.4, 24, 24]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

export default function FarmScene({ growth, rainLevel, alertLevel }: FarmProps) {
  return (
    <Canvas
      camera={{ position: [9, 7, 11], fov: 42 }}
      style={{ borderRadius: "14px" }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={[SKY[alertLevel]]} />
      <fog attach="fog" args={[SKY[alertLevel], 18, 45]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[10, 12, -8]} intensity={1.2} />
      <Ground />
      <Crops growth={growth} />
      <Rain intensity={rainLevel} />
      <Sun alertLevel={alertLevel} />
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.6}
        enablePan={false}
        minDistance={7}
        maxDistance={24}
        maxPolarAngle={Math.PI / 2.2}
      />
    </Canvas>
  );
}
