'use client';

import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSnapshot } from 'valtio';
import { easing } from 'maath';
import { musicBoxState } from './store';
import { Frame } from './frame';
import { FloorGoBackButton } from './floor-go-back-button';

const GOLDENRATIO = 1.61803398875;

export function Frames() {
  const ref = useRef<THREE.Group>(null!);
  const { selectedTrack, tracks } = useSnapshot(musicBoxState);
  const q = useRef(new THREE.Quaternion());
  const p = useRef(new THREE.Vector3());
  const clickedRef = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    if (selectedTrack && ref.current) {
      clickedRef.current = ref.current.getObjectByName(selectedTrack) || null;
      if (clickedRef.current) {
        clickedRef.current.parent?.updateWorldMatrix(true, true);
        clickedRef.current.parent?.localToWorld(p.current.set(0, GOLDENRATIO / 2, 1.25));
        clickedRef.current.parent?.getWorldQuaternion(q.current);
      }
    } else {
      clickedRef.current = null;
      p.current.set(0, 0, 5.5); // Match original default camera position
      q.current.identity();
    }
  }, [selectedTrack]);

  useFrame((state, delta) => {
    easing.damp3(state.camera.position, p.current, 0.4, delta);
    easing.dampQ(state.camera.quaternion, q.current, 0.4, delta);
    
    // Add subtle rotation during transition for a cinematic effect
    if (ref.current) {
      // Smoothly return to original rotation when not transitioning
      easing.damp(ref.current.rotation, 'y', 0, 0.3, delta);
    }
  });

  const handleFrameClick = (trackId: string) => {
    musicBoxState.selectedTrack = selectedTrack === trackId ? null : trackId;
  };

  const handlePointerMissed = () => {
    musicBoxState.selectedTrack = null;
  };

  // Hardcoded layout matching the original pexels demo
  const generateFramePositions = () => {
    const positions: Array<{ position: [number, number, number]; rotation: [number, number, number] }> = [];
    const totalFrames = tracks.length;
    
    // If you have exactly 9 tracks, use the hardcoded pexels-style layout
    if (totalFrames === 9) {
      // Front
      positions.push({ position: [0, 0, 1.5], rotation: [0, 0, 0] });
      // Back
      positions.push({ position: [-0.8, 0, -0.6], rotation: [0, 0, 0] });
      positions.push({ position: [0.8, 0, -0.6], rotation: [0, 0, 0] });
      // Left
      positions.push({ position: [-1.75, 0, 0.25], rotation: [0, Math.PI / 2.5, 0] });
      positions.push({ position: [-2.15, 0, 1.5], rotation: [0, Math.PI / 2.5, 0] });
      positions.push({ position: [-2, 0, 2.75], rotation: [0, Math.PI / 2.5, 0] });
      // Right
      positions.push({ position: [1.75, 0, 0.25], rotation: [0, -Math.PI / 2.5, 0] });
      positions.push({ position: [2.15, 0, 1.5], rotation: [0, -Math.PI / 2.5, 0] });
      positions.push({ position: [2, 0, 2.75], rotation: [0, -Math.PI / 2.5, 0] });
    } else {
      // Dynamic circular layout for other numbers of tracks
      const radius = 3;
      for (let i = 0; i < totalFrames; i++) {
        const angle = (i / totalFrames) * Math.PI * 2;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        positions.push({
          position: [x, 0, z],
          rotation: [0, -angle, 0]
        });
      }
    }
    
    return positions;
  };

  const framePositions = generateFramePositions();

  return (
    <group
      ref={ref}
      onPointerMissed={handlePointerMissed}
    >
      {tracks.slice(0, framePositions.length).map((track, index) => {
        const positionData = framePositions[index] || {
          position: [0, 0, 0] as [number, number, number],
          rotation: [0, 0, 0] as [number, number, number]
        };
        // Always use index to ensure unique keys even if track.id is duplicated
        const uniqueKey = `frame-${index}`;
        const trackId = `${track.id}-${index}`;
        return (
          <Frame
            key={uniqueKey}
            track={track}
            trackId={trackId}
            position={positionData.position}
            rotation={positionData.rotation}
            isActive={selectedTrack === trackId}
            onClick={() => handleFrameClick(trackId)}
          />
        );
      })}
      
      {/* Floor Go Back Button - independent of frames */}
      <FloorGoBackButton />
    </group>
  );
}
