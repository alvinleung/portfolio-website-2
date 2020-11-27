import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

import { Link } from 'gatsby';

import style from './ProjectCard.module.scss';
import ReactiveCard from './ReactiveCard';
import {
  TargetTransformState,
  useProjectCardTransition,
} from './ProjectCardTransition';
import measureElement from '@/hooks/measureElement';

interface Props {
  title: string;
  slug: string;
  catagory: string;
  cover: string;
  tagline: string;
  children?: React.ReactNode;
  isViewing?: boolean;
}
const pageTransitionConfig = { duration: 0.5, ease: [0.16, 1, 0.3, 1] };

// for the non selected project, we want it to animate out
const variantsDefault = {
  initial: {
    opacity: 0,
    transition: pageTransitionConfig,
  },
  enter: {
    y: 0,
    opacity: 1,
    transition: pageTransitionConfig,
  },
  exit: {
    y: 0,
    opacity: 0,
    transition: pageTransitionConfig,
  },
};

// This is an animation template for selected project
// for the selected project, we want it to say at the original position
const variantsSelectedProject = {
  enter: {
    y: 0,
    opacity: 1,
    width: '100%',
    transition: pageTransitionConfig,
  },
  exit: {
    opacity: 1,
    transition: pageTransitionConfig,
  },
};

export const ProjectCard: React.FC<Props> = (props: Props) => {
  const [isViewing, setIsViewing] = useState(false);
  // const [containerBounds, containerRef] = measureBoundingClientRect<
  //   HTMLDivElement
  // >([]);
  const [containerMeasurement, containerRef] = measureElement<HTMLDivElement>(
    [],
  );

  const [
    targetTrasnformState,
    setTargetTransformState,
  ] = useProjectCardTransition();

  useEffect(() => {
    if (props.isViewing) {
      console.log('container measurement ');
      console.log(containerMeasurement);
      setTargetTransformState({
        x: 20,
        y: 20,
        width: window.innerWidth,
        height: window.innerHeight,
        slug: props.slug,
      });
    }
  }, [containerMeasurement]);

  // update card animation only when the
  const cardExitAnimation = useMemo(() => {
    // the user selected this as the viewing project
    if (isViewing) {
      // 370px on the top of the screen is where you want to hit
      // 16px on the left
      const scrollPositionOffset = window.scrollY;
      // console.log(containerRef.current);
      const targetSreenY = 370;
      const targetPosY =
        scrollPositionOffset - containerMeasurement.y + targetTrasnformState.y;

      return {
        ...variantsSelectedProject.exit,
        // y: scrollPositionOffset - containerMeasurement.y + targetSreenY,
        // make it center
        // x: '25vw',
        // width: '100vw',

        y: targetPosY,
      };
    }
    return variantsDefault.exit;
  }, [isViewing]);

  const cardContent = (
    <motion.div
      variants={isViewing ? variantsSelectedProject : variantsDefault}
      initial="initial"
      animate="enter"
      exit={cardExitAnimation}
      // exit="exit"
      ref={containerRef}
      // layout
      // layoutId={props.slug}
    >
      <ReactiveCard
        reactive={!props.isViewing}
        style={{
          backgroundImage: `url(${props.cover})`,
          backgroundSize: 'cover',
        }}
      >
        <motion.div
          className={style.projectType}
          initial={{ opacity: 0 }}
          animate={{ opacity: props.isViewing ? 0 : 1 }}
        >
          {/* UX/UI Design */}
          {props.catagory}
        </motion.div>
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: props.isViewing ? 0 : 1 }}
        >
          {props.title}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: props.isViewing ? 0 : 1 }}
        >
          {/* Build connections in the community one task at a time. */}
          {props.tagline}
        </motion.p>
      </ReactiveCard>
    </motion.div>
  );

  return (
    <Link
      to={!props.isViewing ? props.slug : null}
      onClick={() => {
        setIsViewing(true);
      }}
      style={{ pointerEvents: props.isViewing ? 'none' : 'all' }}
      className={style.projectCardLink}
    >
      {cardContent}
    </Link>
  );
};
