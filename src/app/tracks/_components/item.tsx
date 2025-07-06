'use client';

import * as THREE from 'three';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Image, useScroll,  } from '@react-three/drei';
import { useSnapshot } from 'valtio';
import { easing } from 'maath';
import { state } from './store';
import { Track } from './tracks';
import { DetailsGroup } from './details-group';

type ItemProps = {
  index: number;
  position: [number, number, number];
  scale: [number, number, number];
  track: Track;
};

export function Item({ index, position, scale, track }: ItemProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const scroll = useScroll();
  const { clicked, tracks } = useSnapshot(state);
  const [hovered, setHovered] = useState(false);
  const url = track.image;

  const handleClick = () => {
    state.clicked = index === clicked ? null : index;
  };

  const handlePointerOver = () => setHovered(true);
  const handlePointerOut = () => setHovered(false);

  useFrame((_, delta) => {
    const y = scroll.curve(index / tracks.length - 1.5 / tracks.length, 4 / tracks.length);
    // Animate scale
    easing.damp3(
      ref.current.scale,
      [clicked === index ? 4.7 : scale[0], clicked === index ? 5 : 4 + y, 1],
      0.15,
      delta
    );

    // Animate material properties
    if (ref.current.material) {
        const material = ref.current.material as THREE.MeshBasicMaterial & { grayscale: number, scale: THREE.Vector2 };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        easing.damp(material, 'grayscale' as any, hovered || clicked === index ? 0 : Math.max(0, 1 - y), 0.15, delta);
        easing.dampC(material.color, hovered || clicked === index ? 'white' : '#aaa', hovered ? 0.3 : 0.15, delta);

        material.scale.x = ref.current.scale.x;
        material.scale.y = ref.current.scale.y;
    }


    // Animate position when an item is clicked
    if (clicked !== null && index < clicked) {
      easing.damp(groupRef.current.position, 'x', position[0] - 2, 0.15, delta);
    }
    if (clicked !== null && index > clicked) {
      easing.damp(groupRef.current.position, 'x', position[0] + 2, 0.15, delta);
    }
    if (clicked === null || clicked === index) {
      easing.damp(groupRef.current.position, 'x', position[0], 0.15, delta);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Image
        ref={ref}
        url={url}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        scale={scale as any}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />
      <DetailsGroup isClicked={clicked === index} track={track} />
    </group>
  );
}
