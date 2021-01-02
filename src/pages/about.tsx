import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageProps, graphql } from 'gatsby';
import '../style/typography.scss';
import '../style/layout.scss';
import '../style/variables.scss';
import '../style/reset.scss';
import LandingHero from '@/components/LandingHero';
import SlideInText from '@/components/SlideInText/SlideInText';

const About: React.FC = () => {
  return (
    <>
      <motion.main id="about" className="full-width nav-padding">
        {/* Require framer motion for the page change to work */}
        <h1>
          <SlideInText>A visual designer, web developer</SlideInText>
        </h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </motion.main>
    </>
  );
};

export default About;
