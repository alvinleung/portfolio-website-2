import { motion } from 'framer-motion';
import React, { ReactElement, useState, useEffect } from 'react';
import { AnimationConfig } from '../AnimationConfig';
import { useProjectCardTransition } from '../ProjectCard/ProjectCardTransition';

interface Props {
  children: React.ReactNode;
  key: string;
  visible?: boolean;
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

/**
 *
 * This is a ABSOLUTE position wrapper,
 * the purpose of this is to make the new content overlap
 * the old one, so that we can measure the new content position relative
 * browser's top.
 *
 * TODO: Make ONLY the upcomming page wrapper hidden, let the current page
 * wrapper stay visible (when clicked on card)
 */
export default function TransitionContentWrapper({ children, key }: Props) {
  const [
    targetTransitionState,
    setTargetTransitionState,
  ] = useProjectCardTransition();

  // the the content by default unless the transition has done
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (targetTransitionState.hasTransitionDone) setVisible(true);
    // alert(targetTransitionState.hasTransitionDone);
  }, [targetTransitionState.hasTransitionDone]);

  //use the slug to determine if we are transitioning to other place
  const isOutgoingTransition = key !== targetTransitionState.slug;

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
        // visibility: 'visible',
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
