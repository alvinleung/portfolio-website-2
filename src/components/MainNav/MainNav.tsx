import React from 'react';
import { Link } from 'gatsby';
import * as style from './MainNav.module.scss';
import { motion } from 'framer-motion';
import { AnimationConfig } from '../AnimationConfig';

const MainNav = () => {
  return (
    <motion.div
      className={style.fixedContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        delay: AnimationConfig.LANDING_TIMING.NAVIGATION,
        duration: 0.5,
      }}
    >
      <nav className={'full-width main-grid ' + style.navContainer}>
        <div className="main-grid__side-col--presist">
          <Link to="/" className={style.navLogo}>
            A.
          </Link>
        </div>
        <div
          className="main-grid__primary-col--collapsable label"
          style={{ marginTop: 'auto', marginBottom: 'auto' }}
        >
          Visual + Interaction Designer
        </div>
        <div
          className={
            'main-grid__secondary-col main-grid__secondary-col--mobile-break ' +
            style.navLinkContainer
          }
        >
          <Link to="/" className={style.navLink}>
            Works
          </Link>
          <Link to="/about" className={style.navLink}>
            About
          </Link>
          {/* <Link to="/resume.pdf" className={style.navLink}>
            Resume
          </Link> */}
        </div>
      </nav>
    </motion.div>
  );
};

export default MainNav;
