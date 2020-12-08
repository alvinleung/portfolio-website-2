import React, { useEffect, useRef } from 'react';
import { motion, useViewportScroll, useTransform } from 'framer-motion';
import './LandingHero.scss';
import { AnimationConfig, AnimationVariants } from '../AnimationConfig';

export default () => {
  const { scrollY } = useViewportScroll();
  const headerOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const headerScale = useTransform(scrollY, [0, 400], [1, 0.95]);

  return (
    <div className="LandingHero">
      <motion.h1
        // animate={{
        //   opacity: [0, 1],
        // }}
        className="callout"
        transition={{ ease: 'easeOut', duration: AnimationConfig.FAST }}
        style={{
          opacity: headerOpacity,
          scale: headerScale,
        }}
        exit={AnimationVariants.PRIMARY.exit}
      >
        Hi, this is Alvin! I fight for my users against bad designs, one pixel
        at a time.
        {/* by combining function with aesthetics. */}
        {/* I fight for my users against bad designs by combining
        function with aesthetics. */}
      </motion.h1>
    </div>
  );
};
