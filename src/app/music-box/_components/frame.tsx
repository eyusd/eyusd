'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useCursor, Image, Text } from '@react-three/drei';
import { useSnapshot } from 'valtio';
import { easing } from 'maath';
import type { Song } from '@/lib/types';
import { YouTubePlayer } from './youtube-player';
import { setAsReference, musicBoxState } from './store';

const GOLDENRATIO = 1.61803398875;

type FrameProps = {
  track: Song;
  trackId: string; // Add trackId prop
  position: [number, number, number];
  rotation: [number, number, number];
  isActive: boolean;
  onClick: () => void;
};

export function Frame({ track, trackId, position, rotation, isActive, onClick }: FrameProps) {
  const snap = useSnapshot(musicBoxState);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const image = useRef<any>(null!);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const frame = useRef<any>(null!);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const titleRef = useRef<any>(null!);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const artistRef = useRef<any>(null!);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const titleBackgroundRef = useRef<any>(null!);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const artistBackgroundRef = useRef<any>(null!);
  const [hovered, setHovered] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playIconRef = useRef<any>(null!);
  
  useCursor(hovered || buttonHovered);

  useFrame((state, delta) => {
    if (image.current?.material) {
      // Set zoom to 1 for proper image cropping without distortion
      image.current.material.zoom = 1;
      // Subtle hover scale effect only
      easing.damp3(
        image.current.scale,
        [
          !isActive && hovered ? 1.05 : 1,
          !isActive && hovered ? 1.05 : 1,
          1
        ],
        0.1,
        delta
      );
    }
    
    if (frame.current?.material) {
      // Enhanced glow effect with more pronounced color change
      easing.dampC(frame.current.material.color, hovered ? '#ff8800' : '#ffffff', 0.15, delta);
      // Add emissive glow when hovered for a beautiful outline effect
      easing.dampC(frame.current.material.emissive, hovered ? '#ff4400' : '#222222', 0.15, delta);
    }

    // Animate text positioning when active
    if (titleRef.current) {
      easing.damp3(
        titleRef.current.position,
        isActive ? [0, GOLDENRATIO - 0.1, 0.1] : [0, GOLDENRATIO + 0.2, 0],
        0.2,
        delta
      );
    }
    
    if (artistRef.current) {
      easing.damp3(
        artistRef.current.position,
        isActive ? [0, GOLDENRATIO - 0.2, 0.1] : [0, GOLDENRATIO + 0.1, 0],
        0.2,
        delta
      );
    }

    // Add subtle glow effect when video is playing
    if (frame.current?.material && isVideoPlaying) {
      easing.dampC(frame.current.material.emissive, '#ff6600', 0.1, delta);
    }

    // Animate play icon
    if (playIconRef.current && !isActive && track.videoId) {
      // Gentle pulsing animation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      playIconRef.current.scale.setScalar(scale);
    }

    // Animate play icon
    if (playIconRef.current && !isActive && track.videoId) {
      // Gentle pulsing animation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      playIconRef.current.scale.setScalar(scale);
    }

    // Update background sizes based on text bounds
    if (isActive && titleRef.current && titleBackgroundRef.current) {
      // Force geometry computation and wait for it
      if (titleRef.current.geometry && titleRef.current.geometry.boundingBox) {
        const titleBounds = titleRef.current.geometry.boundingBox;
        const textWidth = titleBounds.max.x - titleBounds.min.x;
        const padding = 0.15; // Add some padding
        const newWidth = Math.max(textWidth + padding, 0.5); // Minimum width
        easing.damp(titleBackgroundRef.current.scale, 'x', newWidth, 0.3, delta);
      }
    }

    if (isActive && artistRef.current && artistBackgroundRef.current) {
      // Force geometry computation and wait for it
      if (artistRef.current.geometry && artistRef.current.geometry.boundingBox) {
        const artistBounds = artistRef.current.geometry.boundingBox;
        const textWidth = artistBounds.max.x - artistBounds.min.x;
        const padding = 0.15; // Add some padding
        const newWidth = Math.max(textWidth + padding, 0.5); // Minimum width
        easing.damp(artistBackgroundRef.current.scale, 'x', newWidth, 0.3, delta);
      }
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <mesh
        name={trackId}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        scale={[1, GOLDENRATIO, 0.05]}
        position={[0, GOLDENRATIO / 2, 0]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#151515"
          metalness={0.5}
          roughness={0.5}
          envMapIntensity={2}
        />
        <mesh
          ref={frame}
          raycast={() => null}
          scale={[0.9, 0.93, 0.9]}
          position={[0, 0, 0.2]}
        >
          <boxGeometry />
          <meshStandardMaterial 
            toneMapped={false} 
            transparent={true}
            opacity={0.9}
            metalness={0.1}
            roughness={0.3}
          />
        </mesh>
        <Image
          raycast={() => null}
          ref={image}
          position={[0, 0, 0.7]}
          scale={[0.8, 0.8 * GOLDENRATIO]}
          url={track.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjY2NjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='}
        />
      </mesh>

      {/* YouTube Player - only show when active and videoId exists */}
      {isActive && track.videoId && (
        <YouTubePlayer
          videoId={track.videoId}
          isActive={isActive}
          position={[0, GOLDENRATIO / 2, 0]}
          onPlay={() => setIsVideoPlaying(true)}
          onPause={() => setIsVideoPlaying(false)}
        />
      )}

      {/* Make Reference Button - only show when active and NOT the center frame */}
      {isActive && trackId !== `${snap.tracks[0]?.id}-0` && (
        <group position={[0, GOLDENRATIO / 2 - 0.5, 0.1]}>
          <mesh
            onClick={(e) => {
              e.stopPropagation();
              setAsReference(track.id);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setButtonHovered(true);
            }}
            onPointerOut={() => {
              setButtonHovered(false);
            }}
            position={[0, 0, 0]}
          >
            <planeGeometry args={[0.3, 0.1]} />
            <meshBasicMaterial 
              color={buttonHovered ? "#333333" : "#000000"} 
              transparent 
              opacity={buttonHovered ? 1.0 : 0.9}
            />
          </mesh>
          <Text
            position={[0, 0, 0.01]}
            fontSize={0.03}
            color="white"
            anchorX="center"
            anchorY="middle"
            fontWeight={900}
            font="/fonts/Montserrat-VariableFont_wght.ttf"
          >
            Make Reference
          </Text>
        </group>
      )}
      
      
      {/* Title Background - only show when active */}
      {isActive && (
        <mesh ref={titleBackgroundRef} position={[0, GOLDENRATIO - 0.1, 0.05]} scale={[1, 1, 1]}>
          <planeGeometry args={[1, 0.08]} />
          <meshBasicMaterial 
            color="#000000" 
            transparent 
            opacity={0.8}
          />
        </mesh>
      )}
      
      <Text
        ref={titleRef}
        maxWidth={0.8}
        anchorX={"center"}
        anchorY="top"
        position={[0, GOLDENRATIO + 0.2, 1]}
        fontSize={0.04}
        color="white"
        outlineWidth={0}
        outlineColor="black"
        outlineOpacity={0.8}
        font="/fonts/Montserrat-VariableFont_wght.ttf"
        fontWeight={700}
      >
        {track.title}
      </Text>
      
      {/* Artist Background - only show when active */}
      {isActive && (
        <mesh ref={artistBackgroundRef} position={[0, GOLDENRATIO - 0.2, 0.05]} scale={[1, 1, 1]}>
          <planeGeometry args={[1, 0.1]} />
          <meshBasicMaterial 
            color="#000000" 
            transparent 
            opacity={0.8}
          />
        </mesh>
      )}
      
      <Text
        ref={artistRef}
        maxWidth={0.8}
        anchorX={"center"}
        anchorY="top"
        position={[0, GOLDENRATIO + 0.1, 1]}
        fontSize={ 0.025}
        color="#ccc"
        outlineWidth={0}
        outlineColor="black"
        outlineOpacity={0.8}
        font="/fonts/Montserrat-VariableFont_wght.ttf"
        fontWeight={500}
      >
        {track.artist}
      </Text>
    </group>
  );
}
