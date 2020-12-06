import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import './ProjectTitle.scss';
import { AnimationConfig } from '@/components/AnimationConfig';

interface Props {
  title: string;
  description: string;
}

const variants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.5, ease: AnimationConfig.EASING },
  },
  exit: {
    opacity: 0,
    y: 30,
    transition: { duration: 0.1 },
  },
};

const ProjectTitle: React.FC<Props> = ({ title, description }: Props) => {
  return (
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
  );
};

export default ProjectTitle;
