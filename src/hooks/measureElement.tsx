import React, { useRef, useState, useEffect } from 'react';

// abstract the logic of getting the client rect

// [bounds, nodeRef]
interface ElementMeasurement {
  x: number;
  y: number;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
}

const measureElement = <T extends HTMLElement>(
  dependencies,
): [ElementMeasurement, React.MutableRefObject<T>] => {
  const [offset, setOffset] = useState<ElementMeasurement>(null);
  const nodeRef = useRef<T>(null);

  // funciton for saving the value to node
  const computeClientRect = () => {
    const x = nodeRef.current.offsetLeft;
    const y = nodeRef.current.offsetTop;
    const width = nodeRef.current.clientWidth;
    const height = nodeRef.current.clientHeight;

    setOffset({
      x: x,
      y: y,
      width: width,
      height: height,
      centerX: x + width / 2,
      centerY: y + height / 2,
    });
  };

  // recompute value when the window resizes
  useEffect(() => {
    window.addEventListener('resize', computeClientRect);
    return () => {
      window.removeEventListener('resize', computeClientRect);
    };
  }, []);

  // recompute the value if the deps changes
  useEffect(() => {
    computeClientRect();
  }, dependencies);

  return [offset, nodeRef];
};

export default measureElement;
