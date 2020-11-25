import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Cursor from '../Cursor/Cursor';

const duration = 0.3;

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
    <AnimatePresence>
      <motion.div
        className="full-width"
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  </>
);

export default PageWrapper;
