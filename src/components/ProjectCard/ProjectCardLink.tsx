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

const DEBUG = false;
const VERBOSE = false;

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
  const [isViewing, setIsViewing] = useState(false);
  const [hasTransitionDone, setHasTransitionDone] = useState(false);
  const [transformSnapshot, setTransformSnapshot] = useTransformSnapshot();
  const handleTransitionComplete = () => {
    setHasTransitionDone(true);
  };

  const cardContent = (
    <ReactiveCard reactive={hasTransitionDone}>
      <CoverImage
        cover={props.cover}
        slug={props.slug}
        willPresist={
          isViewing ||
          (transformSnapshot && transformSnapshot.slug === props.slug)
        }
        scrollToOnEnter={
          transformSnapshot && props.slug === transformSnapshot.slug
        }
        className={style.projectCard}
        onTransitionComplete={handleTransitionComplete}
      >
        <div className={style.projectCardContent}>
          <motion.div
            className={style.projectType}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* UX/UI Design */}
            {props.catagory}
          </motion.div>
          <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {props.title}
          </motion.h3>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Build connections in the community one task at a time. */}
            {props.tagline}
          </motion.p>
        </div>
      </CoverImage>
    </ReactiveCard>
  );

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
};

export default ProjectCardLink;
