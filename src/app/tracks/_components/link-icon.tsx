'use client';

import { useCallback, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Image } from '@react-three/drei';
import { easing } from 'maath';

type LinkIconProps = {
  isClicked: boolean;
  url: string;
  position: [number, number, number];
  service: string;
  scale: number;
};

export function LinkIcon({ isClicked, url, position, service, scale }: LinkIconProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null!);
  const [hovered, setHovered] = useState(false);

  const logoUrl = `/logos/${service}.svg`;

  useFrame((_, delta) => {
    // Animate scale on hover
    const targetScale = hovered ? 1.2 * scale : scale;
    easing.damp3(ref.current.scale, targetScale, 0.1, delta);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClick = useCallback((e: any) => {
    if (!isClicked) {
      return;
    }
    e.stopPropagation(); // Crucial: prevent click from closing the item
    window.open(url, '_blank');
  }, [isClicked, url]);

  return (
    <Image
      ref={ref}
      url={logoUrl}
      scale={scale} // Start scaled down
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
      opacity={isClicked ? 1 : 0} // Fully visible when clicked
      transparent
    />
  );
}
