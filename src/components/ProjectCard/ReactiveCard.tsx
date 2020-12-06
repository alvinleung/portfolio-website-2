import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import style from './ProjectCard.module.scss';

const transitionConfig = { duration: 0.05, ease: 'easeOut' };
interface Props {
  children?: React.ReactNode;
  reactive?: boolean;
  style?;
}

const ReactiveCard: React.FC<Props> = (props) => {
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

  // recalculate bounds when the mouse over
  // make sure the value is fresh
  const handleMouseOver = (e: React.MouseEvent) => {
    calculateContainerBounds();
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

  if (props.reactive)
    // conditionally render the reactive variant of the card
    return (
      <motion.div
        // href="test"
        ref={containerRef}
        // className={style.projectCard}
        transition={transitionConfig}
        // register mouse listeners
        onMouseMove={handleMouseMove}
        onMouseOver={handleMouseOver}
        onHoverEnd={handleHoverEnd}
        // follow the mouse position
        animate={{
          x: containerOffset.x,
          y: containerOffset.y,
          scale: 1,
          opacity: 1,
        }}
        // for mouse behaviour
        // whileHover={{
        //   outline: '10px solid rgba(0,0,0,.1)',
        // }}
        whileTap={{
          scale: 0.99,
        }}
        // style={props.style}
      >
        {props.children}
      </motion.div>
    );
  // non reactive variant of the card
  else
    return (
      <motion.div
        // href="test"
        ref={containerRef}
        className={
          style.projectCard +
          (!props.reactive ? ' ' + style.projectCardViewing : '')
        }
        transition={transitionConfig}
        // register mouse listeners
        style={props.style}
      >
        {props.children}
      </motion.div>
    );
};

export default ReactiveCard;
