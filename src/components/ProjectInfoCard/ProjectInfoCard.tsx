import React from 'react';
import { motion } from 'framer-motion';

import style from './ProjectInfoCard.module.scss';

interface Props {
  name: string;
}

const variants = {
  initial: {
    opacity: 0,
    y: 40,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.25, duration: 0.25 },
  },
  exit: {
    opacity: 0,
    y: 40,
  },
};

export const ProjectInfoCard: React.FC<Props> = ({ name }) => {
  return (
    <motion.div
      className={style.ProjectInfoCard}
      variants={variants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <h1 className={style.ProjectInfoCard__title}>{name}</h1>
      <div className={style.ProjectInfoCard__info}>
        A community-based task finding application that allows users to help
        their community members with household chores.
      </div>
    </motion.div>
  );
};
