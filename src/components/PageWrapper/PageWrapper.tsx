import React from 'react';
import { motion, AnimatePresence, AnimateSharedLayout } from 'framer-motion';
import Cursor from '../Cursor/Cursor';
import MainNav from '../MainNav/MainNav';
import { Footer } from '../Footer/Footer';
import { ProjectCardTransition } from '../ProjectCard/ProjectCardTransition';
import { AnimationConfig } from '../AnimationConfig';

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
    {/* a context provider for the transitions */}
    <ProjectCardTransition>
      <AnimatePresence exitBeforeEnter initial={true}>
        {/* <motion.div key={location.pathname}>{children}</motion.div> */}
        {children}
      </AnimatePresence>
    </ProjectCardTransition>
    <Footer />
  </>
);

export default PageWrapper;
