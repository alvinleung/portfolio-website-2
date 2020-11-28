import React from 'react';
import { motion, AnimatePresence, AnimateSharedLayout } from 'framer-motion';
import Cursor from '../Cursor/Cursor';
import MainNav from '../MainNav/MainNav';
import { Footer } from '../Footer/Footer';
import { ProjectCardTransition } from '../ProjectCard/ProjectCardTransition';
import { AnimationConfig } from '../AnimationConfig';
import TransitionContentWrapper from './TransitionContentWrapper';

const duration = AnimationConfig.FAST;

const variants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      duration: duration,
      // delay: duration,
      when: 'beforeChildren',
    },
  },
  exit: {
    opacity: 0,
    // page transition exit after the children
    transition: { duration: duration, when: 'afterChildren' },
  },
};

const PageWrapper = ({ children, location }) => (
  <>
    <Cursor />
    <MainNav />
    {/* a context provider for the transitions need to be outside of Animate Presence in order to work */}
    <ProjectCardTransition>
      <AnimatePresence initial={true}>
        <TransitionContentWrapper visible={true} key={location.pathname}>
          {/* <motion.div key={location.pathname}>{children}</motion.div> */}
          {children}
          <Footer />
        </TransitionContentWrapper>
      </AnimatePresence>
    </ProjectCardTransition>
  </>
);

export default PageWrapper;
