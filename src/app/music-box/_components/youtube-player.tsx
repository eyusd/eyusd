'use client';

import { useRef } from 'react';
import { Html } from '@react-three/drei';
import YouTube, { YouTubeProps } from 'react-youtube';

type YouTubePlayerProps = {
  videoId: string;
  isActive: boolean;
  position: [number, number, number];
  onPlay?: () => void;
  onPause?: () => void;
};

export function YouTubePlayer({ videoId, isActive, position, onPlay, onPause }: YouTubePlayerProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);

  const opts: YouTubeProps['opts'] = {
    height: '280',
    width: '420',
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      controls: 1,
      disablekb: 0,
      enablejsapi: 1,
      iv_load_policy: 3,
      origin: typeof window !== 'undefined' ? window.location.origin : '',
      playsinline: 1,
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onReady: YouTubeProps['onReady'] = (event: any) => {
    playerRef.current = event.target;
  };

  const handlePlay: YouTubeProps['onPlay'] = () => {
    onPlay?.();
  };

  const handlePause: YouTubeProps['onPause'] = () => {
    onPause?.();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // The YouTube player will handle its own click events
  };

  if (!isActive || !videoId) {
    return null;
  }

  return (
    <Html
      position={position}
      distanceFactor={0.8}
      center
      transform
      sprite
      style={{
        pointerEvents: 'auto',
        userSelect: 'none',
      }}
    >
      <div
        onClick={handleClick}
        className="relative bg-black/30 rounded-lg overflow-hidden shadow-2xl border-2 backdrop-blur-sm"
        style={{
          transform: 'scale(1.0)',
          transformOrigin: 'center',
          background: 'rgba(0, 0, 0, 0.7)',
        }}
      >
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={onReady}
          onPlay={handlePlay}
          onPause={handlePause}
          className="youtube-player"
        />
      </div>
    </Html>
  );
}
