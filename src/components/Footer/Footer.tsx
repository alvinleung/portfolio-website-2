import React from 'react';
import style from './Footer.module.scss';
import { motion } from 'framer-motion';
import { AnimationConfig, AnimationVariants } from '../AnimationConfig';
import useGoogleAnalyticsEvent from '@/hooks/useGoogleAnalyticsEvent';

interface Props {}

export const Footer: React.FC<Props> = () => {
  const logResourceEvent = useGoogleAnalyticsEvent('resource-link-click');
  const handleResourceLinkClick = () => {
    logResourceEvent({
      resourceName: 'resume',
    });
  };

  return (
    <motion.footer
      variants={AnimationVariants.PRIMARY}
      initial="initial"
      animate="enter"
      exit="exit"
      className={style.footer + ' full-width main-grid'}
    >
      <div className="main-grid__full-content">
        <div>Designed and coded by Alvin Leung</div>
        <p>
          {/* <em>Seeking for 2021 Summer Internship</em> */}
          {/* <br /> */}
          <em>alvinleung2009@gmail.com</em>
        </p>
      </div>
      <div className={style.footerGroup + ' main-grid__full-content'}>
        <a href="resume.pdf" target="blank" onClick={handleResourceLinkClick}>
          Résumé
        </a>
      </div>
    </motion.footer>
  );
};
