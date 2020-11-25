import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Link } from 'gatsby';

import style from './ProjectCard.module.scss';

interface Props {
  name?: String;
  children?: React.ReactNode;
}

const transitionConfig = { duration: 0.01, ease: 'easeOut' };
const variantsSelectedProject = {
  initial: {
    y: 100,
  },
  enter: {
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    y: 100,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

const variantsDefault = {
  initial: {
    y: 100,
  },
  enter: {
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    y: 100,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

export const ProjectCard: React.FC<Props> = () => {
  const [containerOffset, setContainerOffset] = useState({ x: 0, y: 0 });
  const [containerBounds, setContainerBounds] = useState<DOMRect>();
  const containerRef = useRef(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    // null check for the container bounds, for rare cases when the event listener
    // fires before the page loaded
    if (!containerBounds) return;
    // translate mouse position to element position, creating dampening effect
    setContainerOffset({
      x: (e.clientX - containerBounds.left - containerBounds.width / 2) * 0.02,
      y: (e.clientY - containerBounds.top - containerBounds.height / 2) * 0.02,
    });
  };

  const handleHoverEnd = (e: MouseEvent) => {
    // reset the elm position when the mouse is off the element
    setContainerOffset({ x: 0, y: 0 });
  };

  const calculateContainerBounds = () => {
    setContainerBounds(containerRef.current.getBoundingClientRect());
  };

  // capture the container state once when the window resize
  useEffect(() => {
    // calculate the element boundary
    // it is expensive to access getboundingclientrect, that why the value is cached
    calculateContainerBounds();

    window.addEventListener('resize', calculateContainerBounds);
    return () => {
      window.removeEventListener('resize', calculateContainerBounds);
    };
  }, []);

  return (
    // <AnimatePresence>
    <Link to="test">
      {/* the container for effects */}
      <motion.div
        variants={variantsDefault}
        initial="inital"
        animate="enter"
        exit="exit"
      >
        <motion.div
          // href="test"
          ref={containerRef}
          className={style.projectCard}
          transition={transitionConfig}
          // register mouse listeners
          onMouseMove={handleMouseMove}
          onHoverEnd={handleHoverEnd}
          // follow the mouse position

          animate={{
            x: containerOffset.x,
            y: containerOffset.y,
            scale: 1,
            opacity: 1,
          }}
          // for mouse behaviour
          whileHover={{
            outline: '10px solid rgba(0,0,0,.1)',
          }}
          whileTap={{
            scale: 0.99,
          }}
        >
          <div className={style.projectType}>UX/UI Design</div>
          <motion.h3>HelpMate</motion.h3>
          <motion.p>
            Build connections in the community one task at a time.
          </motion.p>
        </motion.div>
      </motion.div>
    </Link>
    // </AnimatePresence>
  );
};
