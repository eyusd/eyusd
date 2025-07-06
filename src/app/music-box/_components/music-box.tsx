'use client';

import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { MeshReflectorMaterial, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';
import { useSnapshot } from 'valtio';
import { Frames } from './frames';
import { musicBoxState } from './store';

export function MusicBox() {
  const snap = useSnapshot(musicBoxState);

  useEffect(() => {
    async function fetchSongs() {
      musicBoxState.loading = true;
      try {
        const res = await fetch('/api/songs', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
        });
        const data = await res.json();
        // Compose: [current, ...similar]
        const tracks = [data.current, ...(data.similar || [])];
        musicBoxState.tracks = tracks;
      } catch (error) {
        console.error('Failed to fetch songs:', error);
        musicBoxState.tracks = [];
      } finally {
        musicBoxState.loading = false;
      }
    }
    fetchSongs();
  }, []);

  return (
    <Canvas 
      dpr={[1, 1.5]} 
      camera={{ fov: 70, position: [0, 2, 15] }} // Lowered camera to y=2, z=15
      className="h-screen w-full"
    >
      <color attach="background" args={['#191920']} />
      <fog attach="fog" args={['#191920', 0, 15]} />
      
      <group position={[0, -0.5, 0]}>
        <Frames />
        
        {/* Reflective floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={2048}
            mixBlur={1}
            mixStrength={80}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#050505"
            metalness={0.5}
          />
        </mesh>
      </group>
      
      <Environment preset="city" />
      
      {/* Post-processing effects for transitions */}
      <EffectComposer>
        <DepthOfField
          focusDistance={0}
          focalLength={0.02}
          bokehScale={snap.cameraTransitioning ? 0.5 : 0}
          height={480}
        />
        <Bloom
          intensity={snap.cameraTransitioning ? 0.4 : 0.1}
          luminanceThreshold={0.9}
          luminanceSmoothing={0.025}
          height={300}
        />
      </EffectComposer>
    </Canvas>
  );
}
