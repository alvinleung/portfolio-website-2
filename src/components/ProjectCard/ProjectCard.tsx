import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, useIsPresent, useAnimation, usePresence } from 'framer-motion';

import { Link } from 'gatsby';

import style from './ProjectCard.module.scss';
import ReactiveCard from './ReactiveCard';
import { useProjectCardTransition } from './ProjectCardTransition';
import measureElement from '@/hooks/measureElement';
import { AnimationConfig } from '../AnimationConfig';
import useUniqueId from '@/hooks/useUniqueId';
import useForceUpdate from '@/hooks/useForceUpdate';

const DEBUG = false;

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
      duration: DEBUG ? AnimationConfig.DEBUG : AnimationConfig.NORMAL,
    },
  },
};

/**
 * For the secnario of project page
 */

const variantsViewOnly = {
  initial: {
    opacity: 1,
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
      duration: DEBUG ? AnimationConfig.DEBUG : AnimationConfig.NORMAL,
    },
  },
};

export const ProjectCard: React.FC<Props> = (props: Props) => {
  const forceUpdate = useForceUpdate();
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

  const isPerformingTransition = targetTransformState.slug === props.slug;

  useEffect(() => {
    DEBUG && alert(`${cardInstanceId} is mounting`);
    return () => {
      // when the project card is going to be unmounted, AFTER exit animation
      if (targetTransformState.slug === props.slug) {
        if (DEBUG)
          alert(
            `finished transformation, ${cardInstanceId} is going to unmount`,
          );
        setTargetTransformState({
          ...targetTransformState,
          hasTransitionDone: true,
        });
      }
    };
  }, []);

  // when present state changes
  useEffect(() => {
    if (DEBUG) alert(isPresent + ' is present ' + cardInstanceId);
    if (!isPresent) {
      // has to remove the element manually
      // https://stackoverflow.com/questions/63259019/framer-motion-dom-node-does-not-unmounts-immediately-after-exit-animation
      // if (!isPerformingTransition) {
      // alert(`${cardInstanceId} is safe to be removed`);
      safeToRemove();
      // }
    }
  }, [isPresent]);

  const cardContent = (
    <motion.div
      variants={props.isViewOnly ? variantsViewOnly : variantsDefault}
      animate={animationControl}
      initial="initial"
      // if the one is the selected project
      exit={isViewing ? { opacity: 1 } : 'exit'}
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
