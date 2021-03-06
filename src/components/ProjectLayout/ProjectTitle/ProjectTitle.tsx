import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import './ProjectTitle.scss';
import { AnimationVariants } from '@/components/AnimationConfig';
import SlideInText from '@/components/SlideInText/SlideInText';

interface Props {
  title: string;
  description: string;
}

const ProjectTitle: React.FC<Props> = ({ title, description }: Props) => {
  return (
    <motion.div
      className="ProjectTitle full-width"
      variants={AnimationVariants.PRIMARY}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <h1 className="ProjectTitle__title">{title}</h1>
      <p className="ProjectTitle__description">
        <SlideInText>{description}</SlideInText>
      </p>
    </motion.div>
  );
};

export default ProjectTitle;
