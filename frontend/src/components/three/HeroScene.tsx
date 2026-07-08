import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "../ThemeProvider";

// Generates points on the surface of a sphere
function generateSpherePoints(count: number, radius: number) {
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    
    points[i * 3] = x;
    points[i * 3 + 1] = y;
    points[i * 3 + 2] = z;
  }
  return points;
}

function ParticleSphere({ theme }: { theme: "light" | "dark" }) {
  const ref = useRef<THREE.Points>(null);
  
  const sphere = useMemo(() => generateSpherePoints(3000, 1.8), []);

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#10B981"
          size={0.012}
          sizeAttenuation={true}
          depthWrite={false}
          blending={theme === "dark" ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </Points>
    </group>
  );
}

export function HeroScene() {
  const { resolvedTheme } = useTheme();
  const fogColor = resolvedTheme === "dark" ? "#000000" : "#ffffff";

  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
      <Canvas camera={{ position: [0, 0, 4.5] }}>
        <fog attach="fog" args={[fogColor, 2.5, 6]} />
        <ParticleSphere theme={resolvedTheme} />
      </Canvas>
    </div>
  );
}
