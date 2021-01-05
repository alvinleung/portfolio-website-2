import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageProps, graphql } from 'gatsby';
import '../style/typography.scss';
import '../style/layout.scss';
import '../style/variables.scss';
import '../style/reset.scss';
import LandingHero from '@/components/LandingHero';
import SlideInText from '@/components/SlideInText/SlideInText';
import {
  AnimationConfig,
  AnimationVariants,
} from '@/components/AnimationConfig';

const About: React.FC = () => {
  return (
    <>
      <main id="about" className="full-width nav-padding main-grid">
        {/* Require framer motion for the page change to work */}
        <motion.h1
          className="main-grid__full-content"
          variants={AnimationVariants.PRIMARY}
          // initial="initial"
          animate="enter"
          exit="exit"
        >
          <SlideInText delayBase={0}>
            A visual designer, web developer
          </SlideInText>
        </motion.h1>
        <motion.p
          className="main-grid__full-content"
          variants={AnimationVariants.PRIMARY}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </motion.p>
      </main>
    </>
  );
};

export default About;
