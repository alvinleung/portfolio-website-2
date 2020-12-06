import React, { useRef, useState, useEffect } from 'react';

// abstract the logic of getting the client rect

// [bounds, nodeRef]
import { ElementMeasurement } from './measureElement';

const useMeasurement = <T extends HTMLElement>(): [
  Function,
  React.MutableRefObject<T>,
] => {
  const nodeRef = useRef<T>(null);

  // funciton for saving the value to node
  const computeClientRect = () => {
    const boundingRect = nodeRef.current.getBoundingClientRect();

    const x = boundingRect.left + window.scrollX;
    const y = boundingRect.top + window.scrollY;
    // const width = nodeRef.current.clientWidth;
    // const height = nodeRef.current.clientHeight;
    const width = boundingRect.width;
    const height = boundingRect.height;

    return {
      x: x,
      y: y,
      width: width,
      height: height,
      centerX: x + width / 2,
      centerY: y + height / 2,
    };
  };

  return [computeClientRect, nodeRef];
};

export default useMeasurement;
