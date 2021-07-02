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
          <SlideInText delayBase={0}>Alvin Leung</SlideInText>
        </motion.h1>
        <SlideInParagraph>
          I am T-shaped designer with who can work in both concept and{' '}
          <a href="https://github.com/alvinleung" target="blank">
            code
          </a>
          . With proper research and craft, I like finding opportunities to go
          beyond the functional and create moment that delights, moment that
          moves. In my free time, you can find me working on a{' '}
          <a href="https://github.com/alvinleung/fnf-online" target="blank">
            game
          </a>{' '}
          side project with my brother.
        </SlideInParagraph>
        <SlideInParagraph>
          As a part-time type nerd, my party trick is to elegantly typeset comic
          sans.
        </SlideInParagraph>
        {/* <SlideInParagraph>
          I am a 5th-year student at Simon Fraser University, studying
          Interactive Art and Technology. Thoughout my school years, I often
          find myself wearing different hats in various type of projects, doing
          works that are needed to create an impressive experience. I treat
          every project as an opportunity to learn and improve my skillset.
        </SlideInParagraph> */}
        {/* <SlideInParagraph>
          As a visual communicator, I see myself as a stylist for ideas. I using
          my whatever is in my creative toolbox to deliver an idea in it's most
          potent form. In my past projects, I strive to create designs that are
          subtle yet emotionally impactful.
        </SlideInParagraph> */}
        {/* <SlideInParagraph>
          Recently, I have been playing around in the field of creative coding,
          trying to sythesise my visual design and programming skills into this
          exciting interactive art form. (Demo playground work in progress!)
        </SlideInParagraph> */}
        {/* <SlideInParagraph>
          I am always looking forward to play a role in the making of cool
          things, things which are built with intention, things which are
          memorable.
        </SlideInParagraph> */}

        {/* <SlideInParagraph>
          <ResourceLink url="/resume.pdf" resourceName="resume">
            Résumé
          </ResourceLink>
        </SlideInParagraph> */}
        <SlideInParagraph>
          <ul style={{ listStyle: 'none', margin: '0rem', marginTop: '1rem' }}>
            <li style={{ listStyle: 'none', margin: '0rem' }}>
              <a href="/resume.pdf" target="blank">
                Résumé
              </a>{' '}
            </li>
            <li style={{ listStyle: 'none', margin: '0rem' }}>
              <a
                href="https://www.linkedin.com/in/alvin-leung-06480b18a/"
                target="blank"
              >
                Linkedin
              </a>
            </li>
            <li style={{ listStyle: 'none', margin: '0rem' }}>
              <a href="https://www.instagram.com/alvinn.design/" target="blank">
                Instagram
              </a>
            </li>
          </ul>
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
          // initial={{
          //   opacity: 0,
          // }}
          // animate={{
          //   opacity: 1,
          //   transition: {
          //     delay: 0.5,
          //   },
          // }}
          // exit={{
          //   opacity: 0,
          // }}
        />
      </main>
    </>
  );
};

const SlideInParagraph = ({ children }) => (
  <motion.p
    className={'main-grid__secondary-col '}
    variants={AnimationVariants.PRIMARY}
    initial="initial"
    animate="enter"
    exit="exit"
  >
    {children}
  </motion.p>
);

export default About;
