import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  Float, 
  MeshTransmissionMaterial,
  Text,
  Html,
  Sparkles
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

// Jersey body mesh
function JerseyBody({ team, activeZone, onZoneClick, showHeatmap }: Omit<JerseyProps, 'autoSpin'>) {
  const meshRef = useRef<THREE.Group>(null);
  
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
        <meshPhysicalMaterial
          color={primaryColor}
          metalness={0.15}
          roughness={0.55}
          clearcoat={0.3}
          clearcoatRoughness={0.2}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Jersey front panel accent */}
      <mesh position={[0, 0, 0.226]}>
        <planeGeometry args={[0.88, 1.18]} />
        <meshPhysicalMaterial
          color={primaryColor}
          metalness={0.1}
          roughness={0.6}
          transparent
          opacity={0.95}
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
        font="https://fonts.gstatic.com/s/outfit/v11/QGYvz_MVcBeNP4NjuGObqx1XmO1I4TC1C4G-EiAou6Y.woff2"
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
                opacity={isActive ? 0.85 : showHeatmap ? 0.6 : 0.25}
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
              font="https://fonts.gstatic.com/s/outfit/v11/QGYvz_MVcBeNP4NjuGObqx1XmO1I4TC1C4G-EiAou6Y.woff2"
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
      const material = ringRef.current.material as THREE.MeshPhysicalMaterial;
      material.emissiveIntensity = 0.5 + Math.sin(clock.elapsedTime * 2) * 0.3;
    }
  });

  return (
    <group position={[0, -0.8, 0]}>
      {/* Platform disk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[1.2, 1.2, 0.05, 64]} />
        <meshPhysicalMaterial
          color="#0a0a1a"
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      {/* Neon ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <torusGeometry args={[1.15, 0.02, 16, 100]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
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
    <div style={{ width: '100%', height: '100%', minHeight: '500px' }}>
      <Canvas
        camera={{ position: [0, 0.5, 2.5], fov: 45 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow shadow-mapSize={2048} />
        <directionalLight position={[-5, 3, -5]} intensity={0.4} color="#8B5CF6" />
        <pointLight position={[0, 3, 0]} intensity={0.8} color={team.neonGlow} />
        <spotLight position={[0, 5, 2]} angle={0.3} penumbra={0.5} intensity={1} castShadow color="#ffffff" />

        {/* Environment for reflections */}
        <Environment preset="city" />

        {/* Sparkles around jersey */}
        <Sparkles count={40} scale={3} size={1.5} speed={0.3} color={team.neonGlow} opacity={0.4} />

        {/* Jersey */}
        <AutoRotate autoSpin={autoSpin}>
          <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
            <JerseyBody
              team={team}
              activeZone={activeZone}
              onZoneClick={onZoneClick}
              showHeatmap={showHeatmap}
            />
          </Float>
        </AutoRotate>

        {/* Platform */}
        <Platform color={team.neonGlow} />

        {/* Controls */}
        <OrbitControls
          enablePan={false}
          minDistance={1.5}
          maxDistance={5}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.8}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
