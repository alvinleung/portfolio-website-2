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
    if (containerRef.current) {
      const boundingRect = containerRef.current.getBoundingClientRect();
      setContainerWidth(boundingRect.width);
      x.set(boundingRect.width / 2);
    }
  }, [containerRef]);

  // setup constraint
  useEffect(() => {
    const windowSizeChange = () => {
      const boundingRect = containerRef.current.getBoundingClientRect();
      setContainerWidth(boundingRect.width);
    };
    window.addEventListener('resize', windowSizeChange);
    return () => {
      window.removeEventListener('resize', windowSizeChange);
    };
  }, []);

  const onBeginDrag = (event: React.MouseEvent) => {
    setInitialDragOffset(event.screenX);
    event.preventDefault();
    // return false;
  };

  const onDragUpdate = (event: React.MouseEvent) => {
    x.set(event.screenX - containerRef.current.getBoundingClientRect().left);
  };
  return (
    <div
      ref={containerRef}
      className="comparison-view main-grid__full-content"
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
