import React, { useRef, useEffect, useState } from 'react';
import {
  motion,
  useDragControls,
  useMotionValue,
  useAnimation,
  useTransform,
  PanInfo,
} from 'framer-motion';
import { AnimationVariants } from '@/components/AnimationConfig';
import './ComparisonView.scss';

interface Props {
  children: Array<React.ReactElement>;
}

const ComparisonView: React.FC = ({ children }: Props) => {
  const containerRef = useRef(null);
  const dragHandleRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState();
  const [containerBoundingRect, setContainerBoundingRect] = useState();

  const [initialDragOffset, setInitialDragOffset] = useState(0);
  const dragControls = useDragControls();
  const x = useMotionValue(0);
  const dragPercentage = useTransform(
    x,
    [0, containerWidth],
    [0, containerWidth],
  );

  // setup boundary for value calculation
  useEffect(() => {
    const calculateBounds = () => {
      if (containerRef.current) {
        const boundingRect = containerRef.current.getBoundingClientRect();
        setContainerWidth(boundingRect.width);
        setContainerBoundingRect(boundingRect);
        x.set(boundingRect.width / 2);
      }
    };
    // force calculate once when the component load
    calculateBounds();
    // and recalculate every time the window resize
    window.addEventListener('resize', calculateBounds);
    return () => {
      window.removeEventListener('resize', calculateBounds);
    };
  }, [containerRef]);

  const onBeginDrag = (event: React.MouseEvent) => {
    setInitialDragOffset(event.clientX);
    event.preventDefault();
    // return false;
  };

  const onDragUpdate = (event: React.MouseEvent) => {
    const boundingRect = containerBoundingRect || { left: 0 };
    x.set(event.clientX - boundingRect.left);
  };
  return (
    <div
      ref={containerRef}
      className="comparison-view display-figure main-grid__full-content"
      draggable="true"
      onDragStart={onBeginDrag}
      onMouseMove={onDragUpdate}
    >
      {children.map((child, index) =>
        React.cloneElement(child, {
          dragPosition: dragPercentage,
          key: index,
          isFirstItem: index === 0,
          containerWidth: containerWidth,
        }),
      )}
      <motion.div
        ref={dragHandleRef}
        // layout
        className="comparison-view__split"
        variants={AnimationVariants.PRIMARY}
        initial="initial"
        animate="enter"
        exit="exit"
        style={{
          top: 0,
          x: x,
        }}
      >
        <motion.div className="comparison-view__handle"></motion.div>
      </motion.div>
    </div>
  );
};

export default ComparisonView;
