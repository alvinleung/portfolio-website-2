import React, { useEffect, useRef, useState } from 'react';
import { motion, useViewportScroll, useTransform } from 'framer-motion';
import './LandingHero.scss';
import { AnimationConfig, AnimationVariants } from '../AnimationConfig';
import SlideInText from '../SlideInText/SlideInText';

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
      window.removeEventListener('resize', updateWindowHeight);
    };
  }, []);

  return (
    <div className="LandingHero main-grid">
      {/* <div className="main-grid__side-col label">Hello!</div> */}
      <motion.h1
        // animate={{
        //   opacity: [0, 1],
        // }}
        className="callout main-grid__full-content"
        transition={{ ease: 'easeOut', duration: AnimationConfig.FAST }}
        style={
          {
            // opacity: headerOpacity,
            // scale: headerScale,
          }
        }
        exit={AnimationVariants.PRIMARY.exit}
      >
        <SlideInText>
          {/* Hi, this is Alvin! A UI/UX Designer who is obsessed in creating
          functional yet aesthetic experiences. */}
          {/* Hi, this is Alvin! A technologically supercharged Visual Designer who
          is obsessed in creating functional yet aesthetic experiences. */}
          {/* Hi, this is Alvin! A UI/UX designer with an eye for aesthetic, a mind
          for code and a passion for coffee. */}
          {/* Hi, this is Alvin! A UI/UX designer with an eye for aesthetic, a hand
          for code and a passion for coffee. */}
          Hi, this is Alvin! A UI/UX and Visual Designer who is passionate about
          tackling meaningful design problems with coffee grinds and a
          user-oriented mind.
        </SlideInText>
        {/* by combining function with aesthetics. */}
        {/* I fight for my users against bad designs by combining
        function with aesthetics. */}
      </motion.h1>
    </div>
  );
};
