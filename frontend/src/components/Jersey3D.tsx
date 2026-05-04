import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Float, 
  Text,
} from '@react-three/drei';
import * as THREE from 'three';
import type { TeamData, SponsorZone } from '../data/teamData';

interface JerseyProps {
  team: TeamData;
  activeZone: string | null;
  onZoneClick: (zone: SponsorZone) => void;
  autoSpin: boolean;
  showHeatmap: boolean;
}

// Jersey body mesh with robust texture loading
function JerseyBody({ team, activeZone, onZoneClick, showHeatmap }: Omit<JerseyProps, 'autoSpin'>) {
  const meshRef = useRef<THREE.Group>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      team.frontImage,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        setTexture(tex);
      },
      undefined,
      () => {
        // Fallback: try the alternate path format
        const teamId = team.id;
        loader.load(
          `/assets/jerseys/front/${teamId}.png`,
          (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            setTexture(tex);
          },
          undefined,
          () => console.warn(`Jersey texture not found for ${team.shortName}`)
        );
      }
    );
  }, [team.frontImage, team.id, team.shortName]);

  const primaryColor = new THREE.Color(team.primaryColor);
  const secondaryColor = new THREE.Color(team.secondaryColor);

  // Zone click areas with jersey body coordinate positions
  const zonePositions: Record<string, { pos: [number, number, number]; size: [number, number]; rotation?: [number, number, number] }> = {
    front_chest: { pos: [0, 0.55, 0.42], size: [0.6, 0.25] },
    front_center: { pos: [0, 0.15, 0.42], size: [0.55, 0.25] },
    right_sleeve: { pos: [0.55, 0.55, 0.1], size: [0.25, 0.35], rotation: [0, Math.PI / 2, 0] },
    left_sleeve: { pos: [-0.55, 0.55, 0.1], size: [0.25, 0.35], rotation: [0, -Math.PI / 2, 0] },
    upper_back: { pos: [0, 0.55, -0.42], size: [0.6, 0.25], rotation: [0, Math.PI, 0] },
    lower_back: { pos: [0, 0.1, -0.42], size: [0.55, 0.3], rotation: [0, Math.PI, 0] },
    collar: { pos: [0, 0.9, 0.15], size: [0.35, 0.1] },
  };

  return (
    <group ref={meshRef}>
      {/* Main jersey torso */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.9, 1.2, 0.45]} />
        <meshStandardMaterial
          color={primaryColor}
          metalness={0.2}
          roughness={0.5}
        />
      </mesh>

      {/* Jersey front panel accent */}
      <mesh position={[0, 0.05, 0.226]}>
        <planeGeometry args={[0.88, 1.1]} />
        <meshPhysicalMaterial
          map={texture}
          color={texture ? '#ffffff' : primaryColor}
          metalness={0.1}
          roughness={0.8}
          transparent
          opacity={1}
        />
      </mesh>

      {/* Side stripe accent left */}
      <mesh position={[-0.451, 0, 0]}>
        <planeGeometry args={[0.03, 1.18]} />
        <meshPhysicalMaterial color={secondaryColor} metalness={0.4} roughness={0.3} emissive={secondaryColor} emissiveIntensity={0.3} />
      </mesh>

      {/* Side stripe accent right */}
      <mesh position={[0.451, 0, 0]}>
        <planeGeometry args={[0.03, 1.18]} />
        <meshPhysicalMaterial color={secondaryColor} metalness={0.4} roughness={0.3} emissive={secondaryColor} emissiveIntensity={0.3} />
      </mesh>

      {/* Collar */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[0.45, 0.15, 0.5]} />
        <meshPhysicalMaterial
          color={secondaryColor}
          metalness={0.3}
          roughness={0.4}
          emissive={secondaryColor}
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Right sleeve */}
      <group position={[0.58, 0.35, 0]} rotation={[0, 0, -0.25]}>
        <mesh castShadow>
          <boxGeometry args={[0.35, 0.55, 0.4]} />
          <meshPhysicalMaterial
            color={primaryColor}
            metalness={0.15}
            roughness={0.55}
            clearcoat={0.3}
          />
        </mesh>
        {/* Sleeve band */}
        <mesh position={[0, -0.22, 0]}>
          <boxGeometry args={[0.36, 0.06, 0.41]} />
          <meshPhysicalMaterial
            color={secondaryColor}
            metalness={0.3}
            roughness={0.4}
            emissive={secondaryColor}
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* Left sleeve */}
      <group position={[-0.58, 0.35, 0]} rotation={[0, 0, 0.25]}>
        <mesh castShadow>
          <boxGeometry args={[0.35, 0.55, 0.4]} />
          <meshPhysicalMaterial
            color={primaryColor}
            metalness={0.15}
            roughness={0.55}
            clearcoat={0.3}
          />
        </mesh>
        {/* Sleeve band */}
        <mesh position={[0, -0.22, 0]}>
          <boxGeometry args={[0.36, 0.06, 0.41]} />
          <meshPhysicalMaterial
            color={secondaryColor}
            metalness={0.3}
            roughness={0.4}
            emissive={secondaryColor}
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* Team name on front */}
      <Text
        position={[0, 0.82, 0.23]}
        fontSize={0.07}
        color={team.textColor}
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/plusjakartasans/v8/L0x9DFM6L-r7u3-fX6e_i0Z0A6Z0.woff2"
        fontWeight={700}
      >
        {team.shortName}
      </Text>

      {/* Sponsor zones - interactive hotspots */}
      {team.sponsors.map((sponsor) => {
        const zoneConfig = zonePositions[sponsor.zone];
        if (!zoneConfig) return null;
        const isActive = activeZone === sponsor.zone;
        const heatColor = showHeatmap
          ? new THREE.Color().setHSL(
              (1 - sponsor.visibility_score / 100) * 0.35,
              1,
              0.5
            )
          : new THREE.Color(sponsor.color);

        return (
          <group key={sponsor.zone}>
            <mesh
              position={zoneConfig.pos}
              rotation={zoneConfig.rotation || [0, 0, 0]}
              onClick={(e) => {
                e.stopPropagation();
                onZoneClick(sponsor);
              }}
              onPointerEnter={() => { document.body.style.cursor = 'pointer'; }}
              onPointerLeave={() => { document.body.style.cursor = 'auto'; }}
            >
              <planeGeometry args={zoneConfig.size} />
              <meshPhysicalMaterial
                color={showHeatmap ? heatColor : new THREE.Color(sponsor.color)}
                transparent
                opacity={isActive ? 0.7 : showHeatmap ? 0.5 : 0.15}
                emissive={showHeatmap ? heatColor : new THREE.Color(sponsor.color)}
                emissiveIntensity={isActive ? 1.5 : showHeatmap ? 0.8 : 0.2}
                side={THREE.DoubleSide}
              />
            </mesh>
            
            {/* Sponsor text */}
            <Text
              position={[
                zoneConfig.pos[0],
                zoneConfig.pos[1],
                zoneConfig.pos[2] + (zoneConfig.rotation?.[1] === Math.PI ? -0.01 : 0.01)
              ]}
              rotation={zoneConfig.rotation || [0, 0, 0]}
              fontSize={0.04}
              color="#FFFFFF"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.003}
              outlineColor="#000000"
              font="https://fonts.gstatic.com/s/plusjakartasans/v8/L0x9DFM6L-r7u3-fX6e_i0Z0A6Z0.woff2"
            >
              {sponsor.sponsor}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

// Auto-rotating wrapper
function AutoRotate({ autoSpin, children }: { autoSpin: boolean; children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (autoSpin && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

// Ground platform with neon ring
function Platform({ color }: { color: string }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      const material = ringRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.3 + Math.sin(clock.elapsedTime * 2) * 0.15;
    }
  });

  return (
    <group position={[0, -0.75, 0]}>
      {/* Dark platform disk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[1.2, 1.2, 0.04, 64]} />
        <meshPhysicalMaterial
          color="#0a0a1a"
          metalness={0.9}
          roughness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      {/* Neon ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <torusGeometry args={[1.15, 0.015, 16, 100]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}

// Main 3D Canvas Component
export default function Jersey3DViewer({
  team,
  activeZone,
  onZoneClick,
  autoSpin,
  showHeatmap,
}: JerseyProps) {
  return (
    <div className="w-full h-full min-h-[600px] relative bg-[#020617]">
      <Canvas
        camera={{ position: [0, 0.5, 3], fov: 50 }}
        shadows={false}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#020617']} />
          <ambientLight intensity={2.5} />
          <pointLight position={[10, 10, 10]} intensity={5} />
          <directionalLight position={[0, 10, 0]} intensity={2} />
          
          <AutoRotate autoSpin={autoSpin}>
            <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
              <JerseyBody
                team={team}
                activeZone={activeZone}
                onZoneClick={onZoneClick}
                showHeatmap={showHeatmap}
              />
            </Float>
          </AutoRotate>

          <Platform color={team.neonGlow} />

          <OrbitControls
            enablePan={false}
            minDistance={1.5}
            maxDistance={4.5}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 1.8}
            enableDamping
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>
      
      {/* Loading Overlay */}
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-xs font-black text-primary uppercase tracking-[0.3em]">Loading 3D Assets...</p>
          </div>
        </div>
      }>
        <div className="hidden" />
      </Suspense>
    </div>
  );
}
