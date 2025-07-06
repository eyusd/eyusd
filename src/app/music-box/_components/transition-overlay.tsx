'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSnapshot } from 'valtio';
import { easing } from 'maath';
import { musicBoxState } from './store';

export function TransitionOverlay() {
  const snap = useSnapshot(musicBoxState);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const overlayRef = useRef<any>(null!);

  useFrame((state, delta) => {
    if (overlayRef.current?.material) {
      // Smooth fade in/out based on transition state
      const targetOpacity = snap.transitioning || snap.loading ? 0.7 : 0;
      easing.damp(overlayRef.current.material, 'opacity', targetOpacity, 0.5, delta);
    }
  });

  return (
    <mesh
      ref={overlayRef}
      position={[0, 0, 1]} // In front of everything
      scale={[100, 100, 1]} // Cover entire screen
    >
      <planeGeometry />
      <meshBasicMaterial 
        color="#000000" 
        transparent 
        opacity={0}
      />
    </mesh>
  );
}
