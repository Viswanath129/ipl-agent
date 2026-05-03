import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  Float, 
  MeshTransmissionMaterial,
  Text,
  Html,
  Sparkles,
  MeshReflectorMaterial,
  ContactShadows,
  Stage
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
            {/* Holographic Ring Glow */}
            <mesh
              position={zoneConfig.pos}
              rotation={zoneConfig.rotation || [0, 0, 0]}
            >
              <ringGeometry args={[0.08, 0.1, 32]} />
              <meshBasicMaterial color={sponsor.color} transparent opacity={isActive ? 0.8 : 0.3} />
            </mesh>
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
                opacity={isActive ? 0.4 : showHeatmap ? 0.6 : 0.1}
                emissive={showHeatmap ? heatColor : new THREE.Color(sponsor.color)}
                emissiveIntensity={isActive ? 2 : showHeatmap ? 0.8 : 0.2}
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
              fontSize={0.035}
              color="#FFFFFF"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.002}
              outlineColor="#000000"
              font="https://fonts.gstatic.com/s/plus-jakarta-sans/v8/L0x9DFM6L-r7u3-fX6e_i0Z0A6Z0.woff2"
              fontWeight={800}
            >
              {sponsor.sponsor.toUpperCase()}
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
  return (
    <group position={[0, -0.7, 0]}>
      {/* Premium Reflective Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={40}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050505"
          metalness={0.5}
          mirror={0.5}
        />
      </mesh>
      
      {/* Neon Ring Glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[1.1, 1.2, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[1.05, 1.25, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} />
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
    <div style={{ width: '100%', height: '100%', minHeight: '600px', background: '#000' }}>
      <Canvas
        camera={{ position: [0, 0.5, 2.5], fov: 40 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.5 }}
      >
        <color attach="background" args={['#000000']} />
        
        {/* Cinematic Studio Lighting */}
        <ambientLight intensity={0.1} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow color={team.primaryColor} />
        <spotLight position={[-10, 5, 10]} angle={0.2} penumbra={1} intensity={1.5} color="#3B82F6" />
        <pointLight position={[0, 2, 0]} intensity={1} color={team.neonGlow} />
        
        <Environment preset="studio" blur={1} />
        
        {/* Soft Shadows */}
        <ContactShadows 
          position={[0, -0.7, 0]} 
          opacity={0.65} 
          scale={10} 
          blur={2.5} 
          far={1} 
          color="#000000" 
        />

        {/* Floating Sparkles */}
        <Sparkles count={50} scale={4} size={2} speed={0.4} color={team.neonGlow} opacity={0.6} />

        {/* Main Content */}
        <AutoRotate autoSpin={autoSpin}>
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <JerseyBody
              team={team}
              activeZone={activeZone}
              onZoneClick={onZoneClick}
              showHeatmap={showHeatmap}
            />
          </Float>
        </AutoRotate>

        {/* Reflective Floor */}
        <Platform color={team.neonGlow} />

        {/* Camera Controls */}
        <OrbitControls
          enablePan={false}
          minDistance={1.2}
          maxDistance={4}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.9}
          enableDamping
          dampingFactor={0.05}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
