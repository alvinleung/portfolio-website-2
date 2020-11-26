import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import './ProjectTitle.scss';

interface Props {
  title: string;
  description: string;
}

const variants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: { delay: 0.5 },
  },
  exit: {
    opacity: 0,
    transition: { delay: 0.5 },
  },
};

const ProjectTitle: React.FC<Props> = ({ title, description }: Props) => {
  return (
    <AnimatePresence>
      <motion.div
        className="ProjectTitle full-width"
        variants={variants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        <h1 className="ProjectTitle__title">{title}</h1>
        <p className="ProjectTitle__description">{description}</p>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectTitle;
