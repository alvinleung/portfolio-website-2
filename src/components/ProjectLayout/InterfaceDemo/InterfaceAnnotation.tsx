import React from 'react';
import { useAnnotation } from './InterfaceDemo';

interface Props {
  children: React.ReactChildren;
  target?: string;
  timecode?: number;
  position?: { x: number; y: number };
}

export const InterfaceAnnotation = ({
  timecode,
  position,
  children,
}: Props) => {
  const { showHighlight } = useAnnotation();
  return (
    <a
      onClick={() => timecode && position && showHighlight(timecode, position)}
    >
      {children}
    </a>
  );
};
