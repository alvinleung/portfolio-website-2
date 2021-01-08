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
          className="main-grid__primary-col"
          variants={AnimationVariants.PRIMARY}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          I am currently a 4th-year student at Simon Fraser University, studying
          Interactive Art and Technology. Thoughout my school years, I often
          find myself wearing different hats in projects, doing works that are
          needed to create an impressive experience.
        </motion.p>
        <motion.p
          className="main-grid__primary-col"
          variants={AnimationVariants.PRIMARY}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          My design practice include visual design, art direction, ux/ui design,
          design researches, suprising buch of web development and a *healthy*
          daily doses of coffee.
        </motion.p>
        <motion.p
          className="main-grid__primary-col"
          variants={AnimationVariants.PRIMARY}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          I am always looking forward to play a role in the making of cool
          things, things which built with intention, things which *spark joy*,
          things which are memorable.
        </motion.p>
      </main>
    </>
  );
};

export default About;
