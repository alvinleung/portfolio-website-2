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
import ResourceLink from '@/components/ResourceLink';

const About: React.FC = () => {
  // force scroll to top to create seemless transition
  if (typeof window !== 'undefined') {
    window.scrollTo(0, 0);
  }

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
          <SlideInText delayBase={0}>Hellloooo</SlideInText>
        </motion.h1>
        <SlideInParagraph>
          I am currently a 4th-year student at Simon Fraser University, studying
          Interactive Art and Technology. Thoughout my school years, I often
          find myself wearing different hats in projects, doing works that are
          needed to create an impressive experience.
        </SlideInParagraph>
        <SlideInParagraph>
          My design practice include visual design, art direction, ux/ui design,
          design researches, suprising buch of web development and a daily
          *healthy* doses of coffee.
        </SlideInParagraph>
        {/* <SlideInParagraph>
          I am always looking forward to play a role in the making of cool
          things, things which are built with intention, things which are
          memorable.
        </SlideInParagraph> */}

        <SlideInParagraph>
          <ResourceLink url="/resume.pdf">Resumé</ResourceLink>
        </SlideInParagraph>

        <motion.img
          src="/img/portrait-small.jpg"
          alt="me!"
          className="main-grid__full-width display-figure"
          // animate in
          variants={AnimationVariants.PRIMARY}
          initial="initial"
          animate="enter"
          exit="exit"
        />
      </main>
    </>
  );
};

const SlideInParagraph = ({ children }) => (
  <motion.p
    className="main-grid__primary-col"
    variants={AnimationVariants.PRIMARY}
    initial="initial"
    animate="enter"
    exit="exit"
  >
    {children}
  </motion.p>
);

export default About;
