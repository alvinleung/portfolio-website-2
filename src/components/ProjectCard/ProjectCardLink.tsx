import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  motion,
  useIsPresent,
  useAnimation,
  usePresence,
  transform,
} from 'framer-motion';

import { Link } from 'gatsby';

import {
  projectCard,
  projectCardSmall,
  projectCardContainer,
  projectCardContent,
  projectCardLink,
  projectType,
} from './ProjectCard.module.scss';
import ReactiveCard from './ReactiveCard';
import { AnimationConfig } from '../AnimationConfig';
import CoverImage from './CoverImage';
import {
  useTransformSnapshot,
  useTransitionState,
} from './ProjectCardTransition';
import SlideInText from '../SlideInText/SlideInText';
import { useCursorCustomState } from '../Cursor/Cursor';

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
  scrollToOnEnter?: boolean;
  darkBackground?: boolean;
  large?: boolean;
  small?: boolean;
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

  // change cursor colour
  const { setIsDarkCursorContext } = useCursorCustomState();
  useEffect(() => {
    setIsDarkCursorContext(isMouseOver);
  }, [isMouseOver]);

  const cardContent = (
    <ReactiveCard reactive={hasTransitionDone} followMouse={false}>
      <CoverImage
        cover={props.cover}
        slug={props.slug}
        willPresist={willPresist}
        scrollToOnEnter={
          transformSnapshot &&
          props.slug === transformSnapshot.slug &&
          props.scrollToOnEnter !== false
        }
        isViewOnly={props.isViewOnly}
        className={`${projectCard} ${props.small ? projectCardSmall : ''}`}
        onTransitionComplete={handleTransitionComplete}
      >
        <div className={projectCardContent}>
          {/* the colour background overlay */}
          <motion.div
            initial={{
              position: 'absolute',
              backgroundColor: 'rgba(0,0,0,0)',
              left: '0rem',
              top: '0rem',
              width: '100%',
              height: '100%',
              // scaleX: 0,
              transformOrigin: 'top left',
              zIndex: 1,
            }}
            animate={{
              backgroundColor:
                isMouseOver && isPresent && hasTransitionDone
                  ? 'rgba(0,0,0,.75)'
                  : 'rgba(0,0,0,0)',
              // backdropFilter:
              //   isMouseOver && isPresent && hasTransitionDone
              //     ? 'blur(5px)'
              //     : 'none',
              // scaleX: isMouseOver && isPresent && hasTransitionDone ? 1 : 0,
            }}
            exit={{
              // transformOrigin: 'top left',
              // scaleY: 0,
              backgroundColor: 'rgba(0,0,0,.0)',
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
            style={{
              zIndex: 10,
            }}
            className={projectType}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              color: isMouseOver
                ? '#FFF'
                : props.darkBackground
                ? 'rgba(255,255,255,.7)'
                : 'rgba(40,40,40,.7)',
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: AnimationConfig.FAST }}
          >
            {props.catagory}
          </motion.div>

          <motion.h3
            style={{ zIndex: 1 }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: isMouseOver ? 1 : 0,
              transition: {
                // delay: isMouseOver ? 0 : 0,
                duration: AnimationConfig.FAST,
              },
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: AnimationConfig.FAST }}
          >
            {/* <SlideInText visible={isMouseOver} delayBase={0}> */}
            {props.title}
            {/* </SlideInText> */}
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

  // console.log(willPresist ? 0 : 1);
  // const [transformSnapshot,] = useTransformSnapshot();
  // console.log(props.isViewOnly);

  return (
    <motion.div
      initial={{
        opacity: transformSnapshot === null ? 0 : 1,
      }}
      animate={{
        transition: {
          delay: AnimationConfig.LANDING_TIMING.PROJECT_CARD,
          duration: 0.5,
        },
        opacity: 1,
      }}
    >
      <Link
        to={!props.isViewOnly ? props.slug : null}
        onClick={() => {
          setWillPresist(true);
        }}
        className={projectCardLink}
        onMouseOver={() => {
          setIsMouseOver(true);
        }}
        onMouseLeave={() => {
          setIsMouseOver(false);
        }}
      >
        {cardContent}
      </Link>
    </motion.div>
  );
};

export default ProjectCardLink;
