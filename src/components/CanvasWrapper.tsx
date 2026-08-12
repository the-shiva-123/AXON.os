import React from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './Scene';
import { SceneControlsState } from '../types';

interface CanvasWrapperProps {
  controls: SceneControlsState;
  prefersReducedMotion?: boolean;
}

export const CanvasWrapper: React.FC<CanvasWrapperProps> = ({ controls, prefersReducedMotion }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
      aria-label="3D Interactive Canvas Scene"
    >
      <Scene controls={controls} prefersReducedMotion={prefersReducedMotion} />
    </Canvas>
  );
};

export default CanvasWrapper;
