import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import style from './ProjectCard.module.scss';

interface Props {
  name?: String;
  children?: React.ReactNode;
}

export const ProjectCard: React.FC<Props> = () => {
  const [containerOffset, setContainerOffset] = useState({ x: 0, y: 0 });
  const [containerBounds, setContainerBounds] = useState<DOMRect>();
  const containerRef = useRef(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    setContainerOffset({
      x: (e.clientX - containerBounds.left - containerBounds.width / 2) * 0.02,
      y: (e.clientY - containerBounds.top - containerBounds.height / 2) * 0.02,
    });
  };

  const handleHoverEnd = (e: MouseEvent) => {
    setContainerOffset({ x: 0, y: 0 });
  };

  // capture the container state once
  useEffect(() => {
    setContainerBounds(containerRef.current.getBoundingClientRect());
  }, []);

  return (
    <AnimatePresence>
      <motion.a
        ref={containerRef}
        className={style.projectCard}
        transition={{ duration: 0.1, ease: 'easeOut' }}
        onMouseMove={handleMouseMove}
        onHoverEnd={handleHoverEnd}
        // follow the mouse position
        initial={{ x: 0, y: 10, opacity: 0 }}
        animate={{
          x: containerOffset.x,
          y: containerOffset.y,
          scale: 1,
          opacity: 1,
        }}
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
      </motion.a>
    </AnimatePresence>
  );
};
