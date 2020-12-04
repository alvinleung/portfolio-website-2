import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, useIsPresent, useAnimation, usePresence } from 'framer-motion';

import { Link } from 'gatsby';

import style from './ProjectCard.module.scss';
import ReactiveCard from './ReactiveCard';
import {
  TargetTransformState,
  useProjectCardTransition,
} from './ProjectCardTransition';
import measureElement from '@/hooks/measureElement';
import { AnimationConfig } from '../AnimationConfig';
import useUniqueId from '@/hooks/useUniqueId';
import useForceUpdate from '@/hooks/useForceUpdate';

const DEBUG = true;

interface Props {
  title: string;
  slug: string;
  catagory: string;
  cover: string;
  tagline: string;
  children?: React.ReactNode;
  isViewOnly?: boolean;
}
const pageTransitionConfig = {
  // duration: 20,
  duration: AnimationConfig.NORMAL,
  ease: AnimationConfig.EASING,
};

const CASE_STUDY_PAGE_OFFSET_Y = 370;
const PADDING_SIZE = 16;

// for the non selected project, we want it to animate out
const variantsDefault = {
  initial: {
    opacity: 1,
    transition: pageTransitionConfig,
  },
  enter: {
    y: 0,
    x: 0,
    width: '100%',
    opacity: 1,
    transition: pageTransitionConfig,
  },
  exit: {
    opacity: 0,
    transition: {
      ease: AnimationConfig.EASING,
      duration: DEBUG ? AnimationConfig.DEBUG : 0.3,
      // "anticipation effect to make the animation more vivid/forceful"
      delay: 0.1,
    },
  },
};

/**
 * For the secnario of project page
 */

const variantsViewOnly = {
  initial: {
    opacity: 0,
    height: '80vh',
    transition: pageTransitionConfig,
  },
  enter: {
    y: 0,
    x: 0,
    width: '100%',
    height: '80vh',
    opacity: 1,
    transition: pageTransitionConfig,
  },
  exit: {
    opacity: 0,
    transition: {
      duration: DEBUG ? AnimationConfig.DEBUG : AnimationConfig.FAST,
    },
  },
};

export const ProjectCard: React.FC<Props> = (props: Props) => {
  const cardInstanceId = useUniqueId('ProjectCard');
  const [isViewing, setIsViewing] = useState(false);
  const [containerMeasurement, containerRef] = measureElement<HTMLDivElement>(
    [],
  );
  // for card transition
  const [isPresent, safeToRemove] = usePresence();
  const animationControl = useAnimation();

  const [
    targetTransformState,
    setTargetTransformState,
  ] = useProjectCardTransition();

  // get measurement
  useEffect(() => {
    // The measurement only available in the 2nd render
    // skip the setup code in the first pass
    if (!containerMeasurement || !targetTransformState) return;

    const isFirstRun = targetTransformState.hasTransitionDone === null;

    // if (isFirstRun && targetTransformState.slug !== props.slug) {
    //   setTargetTransformState({
    //     ...targetTransformState,
    //     slug: props.slug,
    //     hasTransitionDone: true,
    //   });
    //   return;
    // }
    // console.log(`test coming from ${cardInstanceId}`);

    if (isFirstRun) {
      setTargetTransformState({
        ...targetTransformState,
        hasTransitionDone: true,
      });
    }

    // dont set transition when current transform is not done
    if (!targetTransformState.hasTransitionDone) return;

    // if targetTransformState is identical to the current container
    // it means that this container is the final state of the animation

    const trasnformState: TargetTransformState = {
      x: containerMeasurement.x,
      y: containerMeasurement.y,
      width: containerMeasurement.width,
      height: containerMeasurement.height,
      slug: props.slug,
      initiatorId: cardInstanceId,
      hasTransitionDone: false,
    };
    console.log(`Setting transform state by ${cardInstanceId}`);
    console.log(trasnformState);

    setTargetTransformState(trasnformState);
  }, [containerMeasurement]);

  useEffect(() => {
    DEBUG && console.log(`${cardInstanceId} is mounting`);
    return () => {
      // when the project card is going to be unmounted, AFTER exit animation
      if (targetTransformState.slug === props.slug) {
        if (DEBUG)
          console.log(
            `finished transformation, ${cardInstanceId} is going to unmount`,
          );
        // setTargetTransformState({
        //   ...targetTransformState,
        //   hasTransitionDone: true,
        // });
      }
    };
  }, []);

  // when present state changes
  useEffect(() => {
    if (DEBUG) console.log(isPresent + ' is present ' + cardInstanceId);
    if (!isPresent) {
      if (
        targetTransformState.hasTransitionDone &&
        targetTransformState.slug === props.slug
      ) {
        animationControl.set({ opacity: 1 });
      }
      safeToRemove();
    }
  }, [isPresent]);

  useEffect(() => {
    if (
      targetTransformState.hasTransitionDone &&
      targetTransformState.slug === props.slug
    ) {
      animationControl.set({ opacity: 1 });
    }
  }, [targetTransformState]);

  const getExitAnimation = useCallback(() => {
    if (targetTransformState === null || containerMeasurement === null) return;
    console.log(`${cardInstanceId} is changing exit animation`);
    console.log(targetTransformState);
    return {
      opacity: 1,
      y: targetTransformState.y - containerMeasurement.y,
      x: targetTransformState.x - containerMeasurement.x,
      width: targetTransformState.width,
      height: targetTransformState.height,
      transition: variantsDefault.exit.transition,
    };
  }, [targetTransformState, containerMeasurement, isViewing]);

  const cardContent = (
    <motion.div
      variants={props.isViewOnly ? variantsViewOnly : variantsDefault}
      animate={animationControl}
      initial="initial"
      // if the one is the selected project
      exit={isViewing ? getExitAnimation : 'exit'}
      // exit="exit"
      ref={containerRef}
      // disabling the pointer even when the view is viewing
      className={style.projectCardContainer}
      style={{
        pointerEvents: props.isViewOnly ? 'none' : 'all',
      }}
      onAnimationComplete={() => {
        setTargetTransformState({
          ...targetTransformState,
          hasTransitionDone: true,
        });
      }}
    >
      <ReactiveCard
        reactive={!props.isViewOnly}
        style={{
          backgroundImage: `url(${props.cover})`,
        }}
      >
        <motion.div
          className={style.projectType}
          initial={{ opacity: 0 }}
          animate={{ opacity: props.isViewOnly ? 0 : 1 }}
        >
          {/* UX/UI Design */}
          {props.catagory}
        </motion.div>
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: props.isViewOnly ? 0 : 1 }}
        >
          b{props.title}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: props.isViewOnly ? 0 : 1 }}
        >
          {/* Build connections in the community one task at a time. */}
          {props.tagline}
        </motion.p>
      </ReactiveCard>
    </motion.div>
  );

  if (!props.isViewOnly) {
    return (
      <Link
        to={!props.isViewOnly ? props.slug : null}
        onClick={() => {
          setIsViewing(true);
        }}
        className={style.projectCardLink}
      >
        {cardContent}
      </Link>
    );
  } else {
    return cardContent;
  }
};
