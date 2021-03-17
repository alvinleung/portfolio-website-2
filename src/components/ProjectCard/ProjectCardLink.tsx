import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  motion,
  useIsPresent,
  useAnimation,
  usePresence,
  transform,
} from 'framer-motion';

import { Link } from 'gatsby';

import style from './ProjectCard.module.scss';
import ReactiveCard from './ReactiveCard';
import { AnimationConfig } from '../AnimationConfig';
import CoverImage from './CoverImage';
import {
  useTransformSnapshot,
  useTransitionState,
} from './ProjectCardTransition';
import SlideInText from '../SlideInText/SlideInText';

const DEBUG = false;
const VERBOSE = false;

const variantCardContent = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
  },
};

interface Props {
  title: string;
  slug: string;
  catagory: string;
  cover: string;
  tagline: string;
  children?: React.ReactNode;
  isViewOnly?: boolean;
}

const ProjectCardLink: React.FC<Props> = (props: Props) => {
  // Mouse Interaction
  const [isMouseOver, setIsMouseOver] = useState(false);

  // is present
  const isPresent = useIsPresent();

  // determine whether the card will do outgoing transition
  const [willPresist, setWillPresist] = useState(false);

  const [hasTransitionDone, setHasTransitionDone] = useState(false);
  const [transformSnapshot, setTransformSnapshot] = useTransformSnapshot();
  const handleTransitionComplete = () => {
    setHasTransitionDone(true);
  };

  useEffect(() => {
    const handleBackButton = () => {
      if (transformSnapshot && transformSnapshot.slug === props.slug)
        setWillPresist(true);
    };
    window.addEventListener('popstate', handleBackButton);
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, []);

  const cardContent = (
    <ReactiveCard reactive={hasTransitionDone} followMouse={false}>
      <CoverImage
        cover={props.cover}
        slug={props.slug}
        willPresist={willPresist}
        scrollToOnEnter={
          transformSnapshot && props.slug === transformSnapshot.slug
        }
        className={style.projectCard}
        onTransitionComplete={handleTransitionComplete}
      >
        <div className={style.projectCardContent}>
          {/* the colour background overlay */}
          <motion.div
            initial={{
              position: 'absolute',
              backgroundColor: 'rgba(0,0,0,1)',
              left: '0rem',
              top: '0rem',
              width: '100%',
              height: '100%',
              scaleX: 0,
              transformOrigin: 'top left',
              zIndex: 1,
            }}
            animate={{
              scaleX: isMouseOver && isPresent && hasTransitionDone ? 1 : 0,
            }}
            exit={{
              transformOrigin: 'top right',
              scaleX: 0,
              transition: {
                duration: AnimationConfig.FAST,
                ease: AnimationConfig.EASING_INVERTED,
              },
            }}
            transition={{
              ease: AnimationConfig.EASING,
              duration: AnimationConfig.NORMAL,
            }}
          />
          {/* Card content */}
          <motion.div
            style={{ zIndex: 1 }}
            className={style.projectType}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: AnimationConfig.FAST }}
          >
            {/* UX/UI Design */}
            {props.catagory}
          </motion.div>
          <motion.h3
            style={{ zIndex: 1 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: AnimationConfig.FAST }}
          >
            <SlideInText visible={isMouseOver} delayBase={0}>
              {props.title}
            </SlideInText>
          </motion.h3>
          <motion.p
            style={{ zIndex: 1 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: AnimationConfig.FAST }}
          >
            {/* Build connections in the community one task at a time. */}
            <SlideInText visible={isMouseOver} delayBase={0}>
              {props.tagline}
            </SlideInText>
          </motion.p>
        </div>
      </CoverImage>
    </ReactiveCard>
  );

  return (
    <Link
      to={!props.isViewOnly ? props.slug : null}
      onClick={() => {
        setWillPresist(true);
      }}
      className={style.projectCardLink}
      onMouseOver={() => setIsMouseOver(true)}
      onMouseOut={() => setIsMouseOver(false)}
    >
      {cardContent}
    </Link>
  );
};

export default ProjectCardLink;
