import { motion } from 'framer-motion';
import React from 'react';
import { AnimationConfig } from '../AnimationConfig';

const labelVariants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      delay: AnimationConfig.LANDING_TIMING.CATAGORY_LABEL,
      duration: AnimationConfig.NORMAL,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: AnimationConfig.FAST,
    },
  },
};

const VerticalLabel = ({ children }) => {
  return (
    <motion.div
      variants={labelVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className="main-grid__vertical-label"
      style={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
};

export default VerticalLabel;
