import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Link } from 'gatsby';

import style from './ProjectCard.module.scss';
import ReactiveCard from './ReactiveCard';

interface Props {
  title: string;
  slug: string;
  catagory: string;
  tagline: string;
  children?: React.ReactNode;
  isViewing?: boolean;
}
const pageTransitionConfig = { duration: 0.3, ease: 'easeOut' };

// for the non selected project, we want it to animate out
const variantsDefault = {
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

// for the selected project, we want it to say at the original position
const variantsSelectedProject = {
  initial: {
    y: 0,
    opacity: 1,
    transition: pageTransitionConfig,
  },
  enter: {
    y: 0,
    opacity: 1,
    transition: pageTransitionConfig,
  },
  exit: {
    y: 0,
    scale: 2,
    transition: pageTransitionConfig,
  },
};

export const ProjectCard: React.FC<Props> = (props: Props) => {
  const [isViewing, setIsViewing] = useState(false);

  const cardContent = (
    <AnimatePresence>
      <motion.div
        variants={isViewing ? variantsSelectedProject : variantsDefault}
        initial="inital"
        animate="enter"
        exit="exit"
        layout
        layoutId={props.slug}
      >
        <ReactiveCard reactive={!props.isViewing}>
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
    </AnimatePresence>
  );

  return (
    <Link
      to={!props.isViewing ? props.slug : null}
      onClick={() => {
        setIsViewing(true);
      }}
      className={style.projectCardLink}
    >
      {cardContent}
    </Link>
  );
};
