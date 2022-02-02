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
import {
  motion,
  useAnimation,
  useMotionValue,
  usePresence,
} from 'framer-motion';
import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';
import { AnimationConfig } from '../AnimationConfig';
import { CustomStates, useCursorCustomState } from '../Cursor/Cursor';
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

interface CoverImageProps extends React.HTMLAttributes<HTMLDivElement> {
  cover: string;
  slug: string;
  willPresist?: boolean; // true: presist in the upcomming page, pass dimensions to the context when exit
  style?: object;
  scrollToOnEnter?: boolean;
  onTransitionComplete?: Function;
  onEnterPage?: Function;
  isViewOnly?: boolean;
}

const CoverImage = ({
  cover,
  children,
  slug,
  willPresist,
  onTransitionComplete,
  onEnterPage,
  scrollToOnEnter,
  isViewOnly,
  ...props
}: CoverImageProps) => {
  const [placeholderMeasurement, placeholderRef] =
    measureElement<HTMLDivElement>([]);
  const [transitionState, setTransitionState] = useTransitionState();
  const [transformSnapshot, setTransformSnapshot] = useTransformSnapshot();

  const [isHovering, setIsHovering] = useState(false);
  const [cursorCustomState, , setCursorCustomState] = useCursorCustomState();

  // framer motion uses
  const [isPresent, safeToRemove] = usePresence();
  const control = useAnimation();

  // for measuring interrupted transition
  const [measureCoverImage, coverImageRef] = useMeasurement<HTMLDivElement>();

  // const hasPreviousTransitionState = transitionState !== null;
  const shouldPerformEnteringTransition =
    // hasPreviousTransitionState &&
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
  useLayoutEffect(() => {
    if (!placeholderMeasurement) return;
    if (transitionState === TransitionState.DONE || !isPresent) {
      onTransitionComplete?.();
      control.set({
        x: 0,
        y: 0,
        // width: placeholderMeasurement.width,
        // prevent race condition with placeholderMeasurement, use the natural css method to handle resizing instead
        width: '100%',
        height: placeholderMeasurement.height,
        transition: pageTransitionConfig,
        opacity: 1,
        position: 'relative',
      });
      return;
    }

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
        // x: 0,
        // y: 0,
        width: placeholderMeasurement.width,
        height: placeholderMeasurement.height,
        transition: pageTransitionConfig,
        opacity: 0,
        // position: 'relative',
      });

      control.start({
        opacity: 1,
        transition: { delay: 0.2 },
      });
      onTransitionComplete?.();
    }
    // this will be called on mobile chrome/firefox after you scroll as the viewport changes
    // and this is the suspicious part of the bug

    //BUG: theory: When scrolll chrome/firefox will hide the menu bar,
    // it causes viewport changes, triggering this effect.
    // it will interrupt the exit animation
    // and subsequently causing animate presence stop doing its job.
    //
    // That's why it worked on mobile safari, chrome mobile emulation
    // but not the mobile chrome itself. (browsers which has that frame resizing behaviour when scroll)
  }, [placeholderMeasurement]);

  const resetPosition = () => {
    console.log('reseting position');
    control.set({ position: 'relative', x: 0, y: 0, zIndex: 'auto' });
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

  // useEffect(() => {
  //   if (!placeholderMeasurement || isViewOnly) return;
  //   if (isHovering) {
  //     control.start({
  //       backgroundSize: `100%`,
  //       transition: {
  //         ease: AnimationConfig.EASING,
  //         duration: DEBUG ? AnimationConfig.DEBUG : AnimationConfig.NORMAL,
  //         // "anticipation effect to make the animation more vivid/forceful"
  //       },
  //     });
  //   } else {
  //     control.start({
  //       backgroundSize: `105%`,
  //       transition: {
  //         ease: AnimationConfig.EASING,
  //         duration: DEBUG ? AnimationConfig.DEBUG : AnimationConfig.NORMAL,
  //         // "anticipation effect to make the animation more vivid/forceful"
  //       },
  //     });
  //   }
  // }, [isHovering]);

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isViewOnly || !placeholderMeasurement) return;

    const maxOffset = 30;

    setOffset({
      x:
        (maxOffset * (e.pageX - placeholderMeasurement.x)) /
          placeholderMeasurement.width -
        maxOffset / 2,
      y:
        (maxOffset * (e.pageY - placeholderMeasurement.y)) /
          placeholderMeasurement.height -
        maxOffset / 2,
    });
  };
  // reset hovering
  useEffect(() => {
    if (!isHovering) {
      setOffset({
        x: 0,
        y: 0,
      });
      // setCursorCustomState(CustomStates.NONE);
    } else {
      // !isViewOnly && setCursorCustomState(CustomStates.HIDDEN);
    }
  }, [isHovering, placeholderMeasurement]);

  return (
    <div
      // wrapper dimensions
      // the motion div will try to animate to the wrapper positions
      ref={placeholderRef}
      style={{ width: '100%' }}
      {...props}
      onMouseEnter={(e) => {
        setIsHovering(true);
        handleMouseMove(e);
      }}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        ref={coverImageRef}
        style={{
          // backgroundImage: `url(${cover})`,
          // backgroundPosition: '20% 50%',
          // backgroundPosition: 'center',
          // backgroundSize: 'cover',
          // backgroundSize: '105%',
          // backgroundRepeat: 'no-repeat',
          height: '100%',
          width: '100%',
          overflow: 'hidden',
          // backgroundAttachment: 'scroll',
          // WebkitBackfaceVisibility: 'hidden',
          // backfaceVisibility: 'hidden',
          // willChange: 'backgroundImage',
        }}
        variants={variants}
        initial={getInitialState()}
        animate={control}
        exit={getExitState()}
        onAnimationComplete={handleAnimationComplete}
      >
        <motion.img
          src={cover}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1,
            scale: 1.05,
          }}
          animate={{
            scale: isViewOnly ? 1.05 : isHovering ? 1.02 : 1.05,
            x: offset.x,
            y: offset.y,
            transition: {
              ease: AnimationConfig.EASING,
              duration: DEBUG ? AnimationConfig.DEBUG : AnimationConfig.NORMAL,
            },
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            zIndex: 100,
          }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default CoverImage;
