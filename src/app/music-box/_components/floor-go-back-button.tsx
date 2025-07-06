'use client';

import { useState } from 'react';
import { Text } from '@react-three/drei';
import { useSnapshot } from 'valtio';
import { goBackToPreviousReference, musicBoxState } from './store';

export function FloorGoBackButton() {
  const snap = useSnapshot(musicBoxState);
  const [hovered, setHovered] = useState(false);

  // Don't render if there's no history
  if (snap.referenceHistory.length === 0) {
    return null;
  }

  return (
    <group position={[0, 0, 4]}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          goBackToPreviousReference();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => {
          setHovered(false);
        }}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 4, 0, 0]} // Rotate to lay flat on the floor
      >
        <planeGeometry args={[0.6, 0.2]} />
        <meshBasicMaterial 
          color={hovered ? "#444444" : "#222222"} 
          transparent 
          opacity={hovered ? 1.0 : 0.8}
        />
      </mesh>
      <Text
        position={[0, 0.05, 0]}
        rotation={[-Math.PI / 4, 0, 0]} // Rotate to lay flat on the floor
        fontSize={0.04}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
        fontWeight={900}
        font="/fonts/Montserrat-VariableFont_wght.ttf"
      >
        ← Go Back
      </Text>
    </group>
  );
}
