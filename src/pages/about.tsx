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
import SEOHeader from '@/components/SEOHeader';

const About: React.FC = () => {
  // force scroll to top to create seemless transition
  if (typeof window !== 'undefined') {
    window.scrollTo(0, 0);
  }

  return (
    <>
      <SEOHeader pageTitle="About" />
      <main id="about" className="full-width nav-padding main-grid">
        {/* Require framer motion for the page change to work */}
        <motion.h1
          className="main-grid__primary-col"
          variants={AnimationVariants.PRIMARY}
          // initial="initial"
          animate="enter"
          exit="exit"
        >
          <SlideInText delayBase={0}>
            I am currently a 4th-year student at Simon Fraser University,
            studying Interactive Art and Technology.
          </SlideInText>
        </motion.h1>
        <SlideInParagraph>
          Thoughout my school years, I often find myself wearing different hats
          in various type of projects, doing works that are needed to create an
          impressive experience. I treat every project as an opportunity learn
          and improve my skillset.
        </SlideInParagraph>
        <SlideInParagraph>
          Recently, I have been playing around in the field of creative coding,
          trying to sythesise my visual design and programming skills into this
          exciting interactive art form. (Demo playground work in progress!)
        </SlideInParagraph>
        {/* <SlideInParagraph>
          I am always looking forward to play a role in the making of cool
          things, things which are built with intention, things which are
          memorable.
        </SlideInParagraph> */}

        <SlideInParagraph>
          <ResourceLink url="/resume.pdf" resourceName="resume">
            Résumé
          </ResourceLink>
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
    className={'main-grid__primary-col '}
    variants={AnimationVariants.PRIMARY}
    initial="initial"
    animate="enter"
    exit="exit"
  >
    {children}
  </motion.p>
);

export default About;
