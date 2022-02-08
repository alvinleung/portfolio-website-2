import { motion, useAnimation, usePresence } from 'framer-motion';
import React, { MutableRefObject, useEffect, useRef } from 'react';
import { AnimationConfig } from '../AnimationConfig';
import { useTransformSnapshot } from '../ProjectCard/ProjectCardTransition';

type Props = {
  children: React.ReactNode;
  upcomingRoute: MutableRefObject<string>;
  prevRoute: MutableRefObject<string>;
};

const SLIDE_TRANSITION_OFFSET = 200;

const AboutPageTransition = ({ children, upcomingRoute, prevRoute }: Props) => {
  const transitionAnimation = useAnimation();
  const [isPresent, safeToRemove] = usePresence();

  function checkIsAboutPageTransition() {
    const enterAboutPage = upcomingRoute.current.indexOf('about') !== -1;
    const exitAboutPage = prevRoute.current.indexOf('about') !== -1;
    const isAboutPageTransition = enterAboutPage || exitAboutPage;
    return {
      enterAboutPage,
      exitAboutPage,
      isAboutPageTransition,
    };
  }

  useEffect(() => {
    // re-cehck the about page
    const { isAboutPageTransition, enterAboutPage } =
      checkIsAboutPageTransition();

    if (!isAboutPageTransition) {
      !isPresent && safeToRemove();
      return;
    }

    if (!isPresent && isAboutPageTransition) {
      console.log('exit');
      transitionAnimation.set({
        opacity: 1,
      });
      transitionAnimation.start({
        opacity: 0,
        x: enterAboutPage ? -SLIDE_TRANSITION_OFFSET : SLIDE_TRANSITION_OFFSET,
        transition: {
          duration: AnimationConfig.NORMAL,
          ease: AnimationConfig.EASING_TRANSITION,
        },
      });
      return;
    }

    transitionAnimation.set({
      opacity: 0,
      x: enterAboutPage ? SLIDE_TRANSITION_OFFSET : -SLIDE_TRANSITION_OFFSET,
    });
    transitionAnimation.start({
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: AnimationConfig.EASING,
      },
    });
  }, [isPresent, upcomingRoute, prevRoute]);

  const handleAnimationComplete = () => {
    !isPresent && safeToRemove();
  };

  return (
    <div
      style={{
        overflowX: 'hidden',
      }}
    >
      <motion.div
        initial={{
          opacity: checkIsAboutPageTransition().isAboutPageTransition ? 0 : 1,
        }}
        animate={transitionAnimation}
        // exit={
        //   isAboutPageTransition && {
        //     x: 100,
        //     opacity: 0,
        //     transition: {
        //       duration: AnimationConfig.NORMAL,
        //       ease: AnimationConfig.EASING_TRANSITION,
        //     },
        //   }
        // }
        onAnimationComplete={handleAnimationComplete}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default AboutPageTransition;
