/**
 *
 * This component handle the cover image tranistion effect
 * Goal for this component is to have it auto detect when to do
 * transition on it own
 *
 * used by ProjectCardLink on index page
 * and ProjectCardCover on case study page
 *
 */

import measureElement from '@/hooks/measureElement';
import useMeasurement from '@/hooks/useMeasurement';
import { motion, useAnimation, usePresence } from 'framer-motion';
import React, { useRef, useEffect, ReactNode, CSSProperties } from 'react';
import { AnimationConfig } from '../AnimationConfig';
import {
  TransitionState,
  useTransformSnapshot,
  useTransitionState,
} from './ProjectCardTransition';

const DEBUG = false;
const VERBOSE = true;

const pageTransitionConfig = {
  duration: DEBUG ? AnimationConfig.DEBUG : AnimationConfig.NORMAL,
  ease: AnimationConfig.EASING,
};

const variants = {
  // transition is fixed until the animation finish,
  // this ensure the transition position from the previous transitionSnapshot
  // is referring to the screen space.
  initial: {
    opacity: 0,
    left: 0,
    top: 0,
    right: 0,
    transition: pageTransitionConfig,
  },
  exit: {
    opacity: 0,
    transition: {
      ease: AnimationConfig.EASING,
      duration: DEBUG ? AnimationConfig.DEBUG : AnimationConfig.FAST,
      // "anticipation effect to make the animation more vivid/forceful"
    },
  },
};

interface CoverImageProps {
  cover: string;
  slug: string;
  willPresist?: boolean; // true: presist in the upcomming page, pass dimensions to the context when exit
  style?: object;
  scrollToOnEnter?: boolean;
  children?: React.ReactNode;
  onTransitionComplete?: Function;
  onEnterPage?: Function;
}

const CoverImage = ({
  cover,
  children,
  slug,
  willPresist,
  onTransitionComplete,
  onEnterPage,
  scrollToOnEnter,
  ...props
}: CoverImageProps) => {
  const [placeholderMeasurement, placeholderRef] = measureElement<
    HTMLDivElement
  >([]);
  const [transitionState, setTransitionState] = useTransitionState();
  const [transformSnapshot, setTransformSnapshot] = useTransformSnapshot();

  // framer motion uses
  const [isPresent, safeToRemove] = usePresence();
  const control = useAnimation();

  // for measuring interrupted transition
  const [measureCoverImage, coverImageRef] = useMeasurement();

  const hasPreviousTransitionState = transitionState !== null;
  const shouldPerformEnteringTransition =
    hasPreviousTransitionState &&
    transformSnapshot &&
    slug === transformSnapshot.slug &&
    transitionState !== TransitionState.DONE;

  const isFirstRun = useRef(true);
  if (isFirstRun.current) {
    onEnterPage?.();
    isFirstRun.current = false;
  }

  const updateContextSnapshot = () => {
    // step 1 - measure the current state
    const coverImageMeasurement = measureCoverImage();
    if (!coverImageMeasurement) return; // in case the cover image is not ready yet

    // step 2 - update the snapshot
    setTransformSnapshot({
      x: coverImageMeasurement.x,
      // returning the screen position of the card
      y: coverImageMeasurement.y - window.scrollY,
      width: coverImageMeasurement.width,
      height: coverImageMeasurement.height,
      slug: slug,
    });
  };

  useEffect(() => {
    if (!isPresent) {
      // pass the configuration to the context if this is the card which the user clicked on
      if (willPresist) updateContextSnapshot();
      safeToRemove();
    }
  }, [isPresent]);

  useEffect(() => {
    if (transitionState === TransitionState.INTERRUPTED) {
      updateContextSnapshot();
      setTransitionState(TransitionState.BEGAN);
    }
  }, [transitionState]);

  const scrollToCardPosition = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo(
        0,
        placeholderMeasurement.y -
          window.innerHeight / 2 +
          placeholderMeasurement.height / 2,
      );
    }
  };

  // use animation control to animate the card into the correct layout position
  useEffect(() => {
    if (!placeholderMeasurement) return;
    if (shouldPerformEnteringTransition) {
      if (scrollToOnEnter) scrollToCardPosition();

      // when measurement ready, nudge the animation to the target position
      control.start({
        x: placeholderMeasurement.x,
        y: placeholderMeasurement.y - window.scrollY,
        width: placeholderMeasurement.width,
        height: placeholderMeasurement.height,
        transition: pageTransitionConfig,
      });
    }

    if (!shouldPerformEnteringTransition) {
      control.set({
        x: 0,
        y: 0,
        width: placeholderMeasurement.width,
        height: placeholderMeasurement.height,
        transition: pageTransitionConfig,
        opacity: 0,
        position: 'relative',
      });
      control.start({
        opacity: 1,
      });
      onTransitionComplete?.();
    }
  }, [placeholderMeasurement]);

  const resetPosition = () => {
    control.set({ position: 'relative', x: 0, y: 0 });
  };

  // fire when the object entered
  const handleAnimationComplete = () => {
    // update global transition state when the enter animation finish
    if (
      transitionState !== TransitionState.DONE &&
      isPresent &&
      shouldPerformEnteringTransition
    ) {
      setTransitionState(TransitionState.DONE);
      // change the animation positioning method from fixed to relative
      resetPosition();
      onTransitionComplete?.();
      VERBOSE && console.log(`Transition Done`);
    }
  };

  // Generate the initial animation state
  const getInitialState = () => {
    // the page first load, return
    if (!shouldPerformEnteringTransition) return 'initial';

    // match the position of previous page's cover
    return {
      ...variants.initial,
      x: transformSnapshot.x,
      y: transformSnapshot.y,
      width: transformSnapshot.width,
      height: transformSnapshot.height,
      opacity: 1,
      position: 'fixed',
      zIndex: 1000,
    };
  };

  const getExitState = () => {
    if (!willPresist) return 'exit';
    return {
      ...variants.exit,
      opacity: 1,
    };
  };

  return (
    <div
      // wrapper dimensions
      // the motion div will try to animate to the wrapper positions
      ref={placeholderRef}
      {...props}
    >
      <motion.div
        ref={coverImageRef}
        style={{
          backgroundImage: `url(${cover})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundAttachment: 'scroll',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
        }}
        variants={variants}
        initial={getInitialState()}
        animate={control}
        exit={getExitState()}
        onAnimationComplete={handleAnimationComplete}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default CoverImage;
