import React, { useEffect, useRef, useState } from 'react';
import { motion, useViewportScroll, useTransform } from 'framer-motion';
import './LandingHero.scss';
import { AnimationConfig, AnimationVariants } from '../AnimationConfig';

export default () => {
  const { scrollY } = useViewportScroll();

  const [windowHeight, setWindowHeight] = useState(0);
  const fullyHiddenPos = windowHeight * 0.25; // determine at which scroll position should it be hidden

  const headerOpacity = useTransform(scrollY, [0, fullyHiddenPos], [1, 0]);
  const headerScale = useTransform(scrollY, [0, fullyHiddenPos], [1, 0.95]);

  useEffect(() => {
    // for SSR support
    if (typeof window === 'undefined') return;

    const updateWindowHeight = () => {
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', updateWindowHeight);
    updateWindowHeight();
    return () => {
      window.addEventListener('resize', updateWindowHeight);
    };
  }, []);

  return (
    <div className="LandingHero">
      <motion.h1
        // animate={{
        //   opacity: [0, 1],
        // }}
        className="callout "
        transition={{ ease: 'easeOut', duration: AnimationConfig.FAST }}
        style={{
          opacity: headerOpacity,
          scale: headerScale,
        }}
        exit={AnimationVariants.PRIMARY.exit}
      >
        Hi, this is Alvin! A UX/UI designer who is interested in creating
        functional yet aesthetic experiences.
        {/* by combining function with aesthetics. */}
        {/* I fight for my users against bad designs by combining
        function with aesthetics. */}
      </motion.h1>
    </div>
  );
};
