import { useRef } from "react";
import { Track } from "./tracks";
import { Group } from "three";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { LinkIcon } from "./link-icon";

type DetailsGroupProps = { isClicked: boolean; track: Track };

export function DetailsGroup({ isClicked, track }: DetailsGroupProps) {
  const groupRef = useRef<Group>(null!);

  useFrame((_, delta) => {
    // Animate the entire group's opacity for a clean fade-in/out effect
    easing.damp3(
      groupRef.current.scale,
      [isClicked ? 1 : 0, isClicked ? 1 : 0, isClicked ? 1 : 0],
      0.2,
      delta
    );

    // Animate the group's position to slide up from behind the cover
    easing.damp3(
      groupRef.current.position,
      [0, isClicked ? -0.2 : -1, 0.1],
      0.2,
      delta
    );
  });

  if (!track || !track.links) return null;

  const validLinks = Object.entries(track.links).filter(
    ([key]) => key !== "unreleased"
  );

  return (
    <group position-y={0} ref={groupRef} visible={isClicked}>
      {validLinks.map(([service, url], i) => {
          // // Arrange icons in a clean, centered horizontal row
          // const iconX = (i - (validLinks.length - 1) / 2) * 0.9;
          // Arrange icons in grid-like layout
          const iconX = (i % 3) * 0.8 - 0.8; // 3 icons per row, centered
          const iconY = Math.floor(i / 3) * -0.8; // New row every 3 icons

          return (
            <LinkIcon
              key={service}
              isClicked={isClicked}
              service={service}
              url={url}
              position={[iconX, iconY, 0]}
              scale={0.5}
            />
          );
        })}
    </group>
  );
}
