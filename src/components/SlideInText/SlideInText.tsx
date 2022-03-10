import React, { CSSProperties } from 'react';
import { motion } from 'framer-motion';

import * as _style from './SlideInText.module.scss';
import { AnimationConfig } from '../AnimationConfig';

interface Props {
  children: string;
  visible?: boolean;
  delayFactor?: number;
  delayBase?: number;
  duration?: number;
  style?: CSSProperties;
}

const wordVariants = {
  initial: {
    y: '1.03em',
  },
  enter: { y: 0 },
  exit: {},
};

// const DELAY_FACTOR = 1.5;
const DELAY_FACTOR = 1.8;
const DELAY_BASE = 0.2;

const SlideInText: React.FC<Props> = ({
  children,
  delayFactor = DELAY_FACTOR,
  delayBase = DELAY_BASE,
  visible = true,
  duration,
  style,
}: Props) => {
  // make sure that we are working with text
  // if (typeof children !== 'string') return children;

  const words = React.useMemo(() => {
    if (typeof children !== 'string') {
      // split it
      let words = [];
      React.Children.forEach(children, (child) => {
        // either split the string into words or make it a word of itself
        if (typeof child === 'string') {
          const withoutTrailingSpace = (child as string).replace(/\s+$/, '');
          words = [...words, ...withoutTrailingSpace.split(' ')];
        } else {
          words = [...words, child];
        }
      });
      return words;
    }
    return (children as string).split(' ');
  }, [children]);

  // const words = (children as string).split(' ');

  return (
    <span className={_style.wordContainer} style={style}>
      {words.map((word, index) => {
        return (
          <span key={index} className={_style.word}>
            <motion.span
              variants={wordVariants}
              initial="initial"
              animate={visible ? 'enter' : 'initial'}
              exit="exit"
              transition={{
                delay: visible ? index * 0.01 * delayFactor + delayBase : 0,
                ease: visible
                  ? AnimationConfig.EASING
                  : AnimationConfig.EASING_SOFT,
                duration: visible
                  ? AnimationConfig.NORMAL
                  : AnimationConfig.FAST,
                // duration: duration || AnimationConfig.NORMAL,
              }}
            >
              {word}
              {` `}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
};

export default SlideInText;
