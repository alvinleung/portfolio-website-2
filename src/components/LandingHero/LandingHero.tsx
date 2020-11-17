import React, { useRef } from 'react';
import { motion, useViewportScroll, useTransform } from 'framer-motion';
import './LandingHero.scss';

export default () => {
  const { scrollY } = useViewportScroll();
  const headerOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const headerScale = useTransform(scrollY, [0, 400], [1, 0.98]);

  return (
    <div className="LandingHero">
      <motion.h1
        style={{
          opacity: headerOpacity,
          scale: headerScale,
        }}
      >
        Hi, this is Alvin. I fight for my users against bad designs by combining
        function with aesthetics.
      </motion.h1>
    </div>
  );
};
