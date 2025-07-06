'use client';

import { useThree } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import { useSnapshot } from 'valtio';
import { state } from './store';
import { Minimap } from './minimap';
import { Item } from './item';

type ItemsProps = {
  w?: number;
  gap?: number;
};

export function Items({ w = 0.7, gap = 0.15 }: ItemsProps) {
  const { tracks } = useSnapshot(state);
  const { width } = useThree((state) => state.viewport);
  const xW = w + gap;

  return (
    <ScrollControls horizontal damping={0.1} pages={(width - xW + tracks.length * xW) / width}>
      <Minimap />
      <Scroll>
        {tracks.map((track, i) => (
          <Item key={i} index={i} position={[i * xW, 0, 0]} scale={[w, 4, 1]} track={track} />
        ))}
      </Scroll>
    </ScrollControls>
  );
}
