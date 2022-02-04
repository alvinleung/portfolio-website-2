import React, { useRef, useEffect, useState } from 'react';
import {
  motion,
  useDragControls,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import { useCursorCustomState, CustomStates } from '../../Cursor/Cursor';
import { AnimationVariants } from '@/components/AnimationConfig';
import './ComparisonView.scss';

interface Props {
  children: Array<React.ReactElement>;
}

enum InputMode {
  MOUSE,
  TOUCH,
}

const ComparisonView: React.FC = ({ children }: Props) => {
  const containerRef = useRef(null);
  const dragHandleRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState();
  const [containerBoundingRect, setContainerBoundingRect] = useState();
  const [allowDrag, setAllowDrag] = useState(false);
  const [inputMode, setInputMode] = useState(InputMode.MOUSE);

  const { setCursorCustomState } = useCursorCustomState();

  const [initialDragOffset, setInitialDragOffset] = useState(0);
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

  const setSplitPosition = (posX) => {
    const boundingRect = containerBoundingRect || { left: 0 };
    x.set(posX - boundingRect.left);
  };

  const onBeginDrag = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  const onDragUpdate = (event: React.MouseEvent) => {
    if (!allowDrag) return;
    setSplitPosition(event.clientX);
  };

  const onMouseOver = () => {
    setCursorCustomState(CustomStates.HORIZONTAL_SLIDE);
  };
  const onMouseOut = () => {
    setCursorCustomState(CustomStates.NONE);
  };

  const onMouseUp = () => {
    setAllowDrag(false);
  };
  const onMouseDown = (event: React.MouseEvent) => {
    if (inputMode !== InputMode.MOUSE) return;

    setAllowDrag(true);
    setInitialDragOffset(event.clientX);
    setSplitPosition(event.clientX);
  };

  // Touch equivilant of the mouse interaction
  const onTouchMove = (event: React.TouchEvent) => {
    if (!allowDrag) return;
    setSplitPosition(event.touches[0].clientX);
  };
  const onTouchStart = (event: React.TouchEvent) => {
    setInputMode(InputMode.TOUCH);
    setAllowDrag(true);
    setInitialDragOffset(event.touches[0].clientX);
    setSplitPosition(event.touches[0].clientX);
  };
  const onTouchEnd = (event: React.TouchEvent) => {
    setAllowDrag(false);
  };

  return (
    <div
      ref={containerRef}
      className="comparison-view main-grid__full-content"
      draggable="true"
      onMouseMove={onDragUpdate}
      onTouchMove={onTouchMove}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onDragStart={onBeginDrag}
      onMouseOver={onMouseOver}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseOut={onMouseOut}
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
