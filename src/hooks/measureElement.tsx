import React, { useRef, useState, useEffect } from 'react';

// abstract the logic of getting the client rect

// [bounds, nodeRef]
interface ElementMeasurement {
  x: number;
  y: number;
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
    setOffset({
      x: nodeRef.current.offsetLeft,
      y: nodeRef.current.offsetTop,
      width: nodeRef.current.clientWidth,
      height: nodeRef.current.clientHeight,
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
