import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { SceneControlsState, ColorTheme } from '../types';

interface SceneProps {
  controls: SceneControlsState;
  prefersReducedMotion?: boolean;
}

// Map color themes to Google Material hex codes
const themeHexMap: Record<ColorTheme, string> = {
  blue: '#1A73E8',
  red: '#EA4335',
  yellow: '#FBBC04',
  green: '#34A853',
};

const themeGlowMap: Record<ColorTheme, string> = {
  blue: '#8AB4F8',
  red: '#F28B82',
  yellow: '#FDD663',
  green: '#81C995',
};

// Outer Interactive Mesh Component
const InteractiveModel: React.FC<{
  controls: SceneControlsState;
  prefersReducedMotion?: boolean;
}> = ({ controls, prefersReducedMotion }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const innerWireframeRef = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);

  const { pointer } = useThree();

  // Create geometry based on modelType
  const geometry = useMemo(() => {
    switch (controls.modelType) {
      case 'sphere':
        return new THREE.IcosahedronGeometry(1.6, 3);
      case 'torus':
        return new THREE.TorusKnotGeometry(1.2, 0.4, 128, 32);
      case 'quantum':
      default:
        // Octahedron / Polyhedron for Google Quantum Glass Prism
        return new THREE.OctahedronGeometry(1.8, 1);
    }
  }, [controls.modelType]);

  // Frame update loop for smooth rotation and subtle parallax
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Apply continuous rotation if autoRotate is enabled and reduced motion is off
    if (controls.autoRotate && !prefersReducedMotion) {
      const speedFactor = controls.rotationSpeed * delta;
      meshRef.current.rotation.y += 0.4 * speedFactor;
      meshRef.current.rotation.x += 0.2 * speedFactor;
      if (innerWireframeRef.current) {
        innerWireframeRef.current.rotation.y -= 0.6 * speedFactor;
        innerWireframeRef.current.rotation.z += 0.3 * speedFactor;
      }
    }

    // Cursor tracking parallax easing
    if (!prefersReducedMotion && groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        pointer.y * 0.2,
        0.05
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.3,
        0.05
      );
    }
  });

  const activeColor = themeHexMap[controls.colorTheme];
  const glowColor = themeGlowMap[controls.colorTheme];

  return (
    <group ref={groupRef}>
      {/* Outer Floating Polyhedron */}
      <Float
        speed={prefersReducedMotion ? 0 : 2}
        rotationIntensity={prefersReducedMotion ? 0 : 0.5}
        floatIntensity={prefersReducedMotion ? 0 : 0.8}
      >
        <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
          {controls.materialType === 'glass' ? (
            <meshPhysicalMaterial
              color={activeColor}
              transmission={0.85}
              opacity={1}
              transparent
              roughness={0.1}
              ior={1.5}
              thickness={1.2}
              specularIntensity={1.2}
              clearcoat={1}
              clearcoatRoughness={0.1}
              wireframe={controls.wireframe}
            />
          ) : controls.materialType === 'metal' ? (
            <meshStandardMaterial
              color={activeColor}
              metalness={0.9}
              roughness={0.15}
              wireframe={controls.wireframe}
            />
          ) : (
            <meshStandardMaterial
              color={activeColor}
              roughness={0.4}
              metalness={0.2}
              wireframe={controls.wireframe}
            />
          )}
        </mesh>

        {/* Inner Glowing Core Structure */}
        <mesh ref={innerWireframeRef} geometry={geometry} scale={0.72}>
          <meshBasicMaterial
            color={glowColor}
            wireframe
            transparent
            opacity={0.65}
          />
        </mesh>

        {/* Core Glowing Light Orb */}
        <pointLight color={glowColor} intensity={3} distance={5} />
      </Float>

      {/* Ground Contact Shadow */}
      <ContactShadows
        position={[0, -2.5, 0]}
        opacity={0.4}
        scale={8}
        blur={2}
        far={4}
      />
    </group>
  );
};

export const Scene: React.FC<SceneProps> = ({ controls, prefersReducedMotion }) => {
  return (
    <>
      {/* Ambient & Directional Google Material Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[8, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-8, -5, -5]} intensity={0.4} color="#8AB4F8" />
      <pointLight position={[0, 4, 2]} intensity={0.8} color="#FFFFFF" />

      {/* Ambient Floating Sparkles Particle Cloud */}
      <Sparkles
        count={prefersReducedMotion ? 20 : 60}
        scale={[10, 10, 10]}
        size={2.5}
        speed={prefersReducedMotion ? 0 : 0.4}
        color={themeGlowMap[controls.colorTheme]}
      />

      {/* Core 3D Mesh */}
      <InteractiveModel controls={controls} prefersReducedMotion={prefersReducedMotion} />

      {/* Orbit Controls with Damping */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 1.7}
        minPolarAngle={Math.PI / 3}
        rotateSpeed={0.5}
        dampingFactor={0.05}
      />
    </>
  );
};

export default Scene;
