import React, { useEffect, useRef } from 'react';
import { motion, useViewportScroll, useTransform } from 'framer-motion';
import './LandingHero.scss';
import { AnimationConfig } from '../AnimationConfig';

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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{
          opacity: 0,
        }}
      >
        Hi, this is Alvin. Lorem ipsum dolor sit amet, consectetur adipiscing
        elit. Sit arcu ornare ipsum, leo, at donec pulvinar.
        {/* I fight for my users against bad designs by combining
        function with aesthetics. */}
      </motion.h1>
    </div>
  );
};
