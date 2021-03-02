import React from 'react';
import style from './Footer.module.scss';
import { motion } from 'framer-motion';
import { AnimationConfig, AnimationVariants } from '../AnimationConfig';

interface Props {}

export const Footer: React.FC<Props> = () => {
  return (
    <motion.footer
      variants={AnimationVariants.PRIMARY}
      initial="initial"
      animate="enter"
      exit="exit"
      className={style.footer + ' full-width main-grid'}
    >
      <div className="main-grid__full-content">
        <div>Designed and Coded by Alvin Leung </div>
        <p>
          <em>Seeking for 2021 Spring Internship</em>
          <em>alvinleung2009@gmail.com</em>
        </p>
        <div className={style.footerGroup}>
          <a href="resume.pdf" target="blank">
            Resume
          </a>
        </div>
      </div>
    </motion.footer>
  );
};
