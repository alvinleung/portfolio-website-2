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
}

const ProjectCardCover = ({ cover, slug }: CoverProps) => {
  return (
    <CoverImage
      // define the style here
      style={{
        width: dimensions.WIDTH,
        height: dimensions.HEIGHT,
        marginLeft: '2rem',
        marginRight: '2rem',
        marginBottom: '4rem',
      }}
      cover={cover}
      slug={slug}
      willPresist
    ></CoverImage>
  );
};

export default ProjectCardCover;
