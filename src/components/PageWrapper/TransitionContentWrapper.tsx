import { motion } from 'framer-motion';
import React, { ReactElement } from 'react';
import { AnimationConfig } from '../AnimationConfig';

interface Props {
  children: React.ReactNode;
  key: string;
  visible: boolean;
}

const variants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      duration: AnimationConfig.FAST,
      // delay: duration,
      when: 'beforeChildren',
    },
  },
  exit: {
    opacity: 0,
    // page transition exit after the children
    transition: { duration: AnimationConfig.FAST, when: 'afterChildren' },
  },
};

export default function TransitionContentWrapper({
  children,
  key,
  visible = false,
}: Props) {
  return (
    <div
      style={{
        display: 'inline-block',
        position: 'absolute',
        left: '0rem',
        top: '0rem',
        width: '100%',
        // the magin below the footer
        paddingBottom: '2rem',
        visibility: visible ? 'visible' : 'hidden',
      }}
      // variants={variants}
      // initial="initial"
      // animate="enter"
      // exit="exit"

      // it's the key that messes up the animation of its' child
      // without the key, the animation at the child wont be working
      key={key}
    >
      {children}
    </div>
  );
}
