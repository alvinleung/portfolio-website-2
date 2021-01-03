import React from 'react';
import { motion } from 'framer-motion';

import style from './SlideInText.module.scss';
import { AnimationConfig } from '../AnimationConfig';

interface Props {
  children: string;
  visible?: boolean;
  delayFactor?: number;
  delayBase?: number;
  duration?: number;
}

const wordVariants = {
  initial: {
    y: '1.1em',
  },
  enter: { y: 0 },
  exit: {},
};

const DELAY_FACTOR = 1.5;
const DELAY_BASE = 0.2;

const SlideInText: React.FC<Props> = ({
  children,
  delayFactor = DELAY_FACTOR,
  delayBase = DELAY_BASE,
  visible = true,
  duration,
}: Props) => {
  // make sure that we are working with text
  if (typeof children !== 'string') return children;

  const words = (children as string).split(' ');

  return (
    <span className={style.wordContainer}>
      {words.map((word, index) => {
        return (
          <span key={index} className={style.word}>
            <motion.span
              variants={wordVariants}
              initial="initial"
              animate={visible ? 'enter' : 'initial'}
              exit="exit"
              transition={{
                delay: index * 0.01 * delayFactor + delayBase,
                // easings: [0.19, 1, 0.22, 1],
                easings: AnimationConfig.EASING,
                duration: duration || AnimationConfig.NORMAL,
              }}
            >{`${word} `}</motion.span>
          </span>
        );
      })}
    </span>
  );
};

export default SlideInText;
