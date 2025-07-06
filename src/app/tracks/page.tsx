"use client";

import { Canvas } from "@react-three/fiber";
import { state } from "./_components/store";
import { Items } from "./_components/items";


export default function Tracks() {
  return (
    <Canvas
      gl={{ antialias: false }}
      dpr={[1, 1.5]}
      onPointerMissed={() => (state.clicked = null)}
    >
      <Items />
    </Canvas>
  );
}
