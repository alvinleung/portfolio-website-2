import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, useIsPresent } from 'framer-motion';

import { Link } from 'gatsby';

import style from './ProjectCard.module.scss';
import ReactiveCard from './ReactiveCard';
import { useProjectCardTransition } from './ProjectCardTransition';
import measureElement from '@/hooks/measureElement';
import { AnimationConfig } from '../AnimationConfig';
import useUniqueId from '@/hooks/useUniqueId';

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

export const ProjectCard: React.FC<Props> = (props: Props) => {
  const cardInstanceId = useUniqueId('ProjectCard');
  const [isViewing, setIsViewing] = useState(false);
  const [containerMeasurement, containerRef] = measureElement<HTMLDivElement>(
    [],
  );
  // for card transition
  const isPresent = useIsPresent();
  const [
    targetTrasnformState,
    setSetTagetTransformState,
  ] = useProjectCardTransition();

  // when the present state is change
  useEffect(() => {
    // when the viewing card is exiting/going to destroy pass the animation state
    // for the upcoming card to pickup
    if (!isPresent && isViewing) {
      setSetTagetTransformState({
        x: containerMeasurement.x,
        y: containerMeasurement.y - window.scrollY,
        width: containerMeasurement.width,
        height: containerMeasurement.height,
        slug: props.slug,
        initiatorId: cardInstanceId,
      });
    }
  }, [isPresent]);

  const cardContent = (
    <motion.div
      variants={variantsDefault}
      animate="enter"
      initial="initial"
      exit="exit"
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
