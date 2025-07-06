'use client';

import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import { useSnapshot } from 'valtio';
import { easing } from 'maath';
import { state } from './store';

const material = new THREE.LineBasicMaterial({ color: 'white' });
const geometry = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(0, -0.5, 0),
  new THREE.Vector3(0, 0.5, 0),
]);

export function Minimap() {
  const ref = useRef<THREE.Group>(null!);
  const scroll = useScroll();
  const { tracks } = useSnapshot(state);
  const { height } = useThree((state) => state.viewport);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.children.forEach((child, index) => {
        const y = scroll.curve(index / tracks.length - 1.5 / tracks.length, 4 / tracks.length);
        easing.damp(child.scale, 'y', 0.15 + y / 6, 0.15, delta);
      });
    }
  });

  return (
    <group ref={ref}>
      {tracks.map((_, i) => (
        <line
          key={i}
          // @ts-expect-error - Three.js line geometry requires this pattern
          geometry={geometry}
          material={material}
          position={[i * 0.06 - tracks.length * 0.03, -height / 2 + 0.6, 0]}
        />
      ))}
    </group>
  );
}
