import React, { useEffect } from 'react';
import { motion, MotionValue } from 'framer-motion';

interface Props {
  src: string;
  label: string;
  dragPosition?: MotionValue;
  isFirstItem?: boolean;
  containerWidth?: number;
}

const ComparisonItem = (props: Props) => {
  return (
    <motion.div
      className="comparison-item"
      style={{
        maxWidth: props.isFirstItem ? 'unset' : props.dragPosition,
      }}
      draggable="false"
    >
      <img
        className="comparison-item__image"
        src={props.src}
        alt={props.label}
        style={{ minWidth: props.containerWidth }}
        draggable="false"
      />
      <div
        className={
          !props.isFirstItem
            ? 'comparison-item__label'
            : 'comparison-item__label comparison-item__label--right'
        }
      >
        {props.label}
      </div>
    </motion.div>
  );
};

export default ComparisonItem;
