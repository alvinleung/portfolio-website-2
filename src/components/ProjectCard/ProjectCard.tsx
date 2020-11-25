import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Link } from 'gatsby';

import style from './ProjectCard.module.scss';
import ReactiveCard from './ReactiveCard';

interface Props {
  name: string;
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
  enter: {
    y: 0,
    opacity: 1,
    transition: pageTransitionConfig,
  },
  exit: {
    y: 0,
    transition: pageTransitionConfig,
  },
};

export const ProjectCard: React.FC<Props> = (props) => {
  const [isViewing, setIsViewing] = useState(false);

  const cardContent = (
    <motion.div
      variants={isViewing ? variantsSelectedProject : variantsDefault}
      initial="inital"
      animate="enter"
      exit="exit"
      layout
      layoutId={props.name}
    >
      <ReactiveCard reactive={!props.isViewing}>
        <motion.div
          className={style.projectType}
          initial={{ opacity: 0 }}
          animate={{ opacity: props.isViewing ? 0 : 1 }}
        >
          UX/UI Design
        </motion.div>
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: props.isViewing ? 0 : 1 }}
        >
          {props.name}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: props.isViewing ? 0 : 1 }}
        >
          Build connections in the community one task at a time.
        </motion.p>
      </ReactiveCard>
    </motion.div>
  );

  return (
    <Link
      to={!props.isViewing ? 'caseStudy' : null}
      onClick={() => {
        setIsViewing(true);
      }}
      className={style.projectCardLink}
    >
      {cardContent}
    </Link>
  );
};
