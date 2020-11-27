import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, useIsPresent } from 'framer-motion';

import { Link } from 'gatsby';

import style from './ProjectCard.module.scss';
import ReactiveCard from './ReactiveCard';
import { useProjectCardTransition } from './ProjectCardTransition';
import measureElement from '@/hooks/measureElement';
import { AnimationConfig } from '../AnimationConfig';

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
    transition: { duration: AnimationConfig.FAST },
  },
};

/**
 * For the secnario of project page
 */

const variantsViewOnly = {
  initial: {
    opacity: 1,
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
    transition: { duration: AnimationConfig.FAST },
  },
};

/**
 * For the secnario of selected but not yet there
 */

// This is an animation template for selected project
// for the selected project, we want it to say at the original position
const variantsSelectedProject = {
  enter: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: pageTransitionConfig,
  },
  exit: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: { duration: AnimationConfig.FAST },
  },
};

export const ProjectCard: React.FC<Props> = (props: Props) => {
  const [isViewing, setIsViewing] = useState(false);
  const [containerMeasurement, containerRef] = measureElement<HTMLDivElement>(
    [],
  );
  // for card transition
  const isPresent = useIsPresent();
  const [
    previousTrasnformState,
    setPreviousTransformState,
  ] = useProjectCardTransition();

  // only run once when the component instantiate
  const cardInitialAnimation = useCallback(() => {
    // null check for previousTransformState, null usually means the user just landed
    if (!previousTrasnformState) return variantsDefault.initial;

    if (previousTrasnformState.slug === props.slug) {
      // run animation if we detect the page is coming from somewhere

      // scroll to top to ready for the effect
      return {
        ...variantsDefault.initial,
        x: previousTrasnformState.x,
        y: previousTrasnformState.y - CASE_STUDY_PAGE_OFFSET_Y,
        width: previousTrasnformState.width,
        height: previousTrasnformState.height,
      };
    }
  }, []);

  // update card animation only when the
  // value of isViewing is changed
  const cardExitAnimation = useCallback(() => {
    // the user selected this as the viewing project
    if (isViewing) {
      // 370px on the top of the screen is where you want to hit
      // 16px on the left
      const scrollPositionOffset = window.scrollY;
      // console.log(containerRef.current);

      // calculate the position
      const targetSreenY =
        window.innerHeight / 2 - containerMeasurement.height / 2;
      const targetPosY =
        scrollPositionOffset - containerMeasurement.y + targetSreenY;

      return {
        ...variantsSelectedProject.exit,
        // y: targetPosY,
      };
    }
    return variantsDefault.exit;
  }, [isViewing]);

  // when the present state is change
  useEffect(() => {
    // when the viewing card is exiting/going to destroy pass the animation state
    // for the upcoming card to pickup
    if (!isPresent && isViewing) {
      setPreviousTransformState({
        x: containerMeasurement.x,
        y: containerMeasurement.y - window.scrollY,
        width: containerMeasurement.width,
        height: containerMeasurement.height,
        slug: props.slug,
      });
    }
  }, [isPresent]);

  // the logic is exposed here in the react update
  // because sometimes the cycle is too late for the animation
  // and we get the effect of a flash of bad layout
  if (isPresent && props.isViewOnly) {
    // for SSR: window object not available on the server
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  }

  const decideVariant = (() => {
    if (props.isViewOnly) return variantsViewOnly;

    if (isViewing) return variantsSelectedProject;

    return variantsDefault;
  })();

  const cardContent = (
    <motion.div
      variants={decideVariant}
      animate="enter"
      initial={cardInitialAnimation}
      exit={cardExitAnimation}
      // exit="exit"
      ref={containerRef}
      // disabling the pointer even when the view is viewing
      className={style.projectCardContainer}
      style={{
        pointerEvents: props.isViewOnly ? 'none' : 'all',
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
          {props.title}
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
