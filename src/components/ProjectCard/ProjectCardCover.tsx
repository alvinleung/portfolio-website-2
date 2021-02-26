import measureElement from '@/hooks/measureElement';
import { motion, useAnimation, usePresence } from 'framer-motion';
import React, { useRef, useEffect } from 'react';
import { AnimationConfig } from '../AnimationConfig';
import {
  TransitionState,
  useTransformSnapshot,
  useTransitionState,
} from './ProjectCardTransition';
import CoverImage from './CoverImage';

const dimensions = {
  WIDTH: 'auto',
  HEIGHT: '80vh',
};

interface CoverProps {
  cover: string;
  slug: string;
  className?: string;
  style?: object;
}

const ProjectCardCover = ({ cover, slug, className, style }: CoverProps) => {
  const handleEnterPage = () => {
    // force scroll to top to create seemless transition
    if (typeof window !== 'undefined') {
      //TODO: Seems like this overriding of scrolling position writes to the reach router
      // scroll position history, so when the user use back button to go back, it tried to restore
      // the scroll position, causing the jump effect.
      window.scrollTo(0, 0);
    }
  };

  return (
    <CoverImage
      // define the style here
      style={{
        width: dimensions.WIDTH,
        height: dimensions.HEIGHT,
        // marginLeft: '1rem',
        // marginRight: '1rem',
        marginBottom: '4rem',
        ...style,
      }}
      className={className}
      onEnterPage={handleEnterPage}
      cover={cover}
      slug={slug}
      willPresist
    />
  );
};

export default ProjectCardCover;
