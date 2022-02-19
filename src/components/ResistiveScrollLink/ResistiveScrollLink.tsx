import {
  animate,
  motion,
  useAnimation,
  useViewportScroll,
} from 'framer-motion';
import React, { useEffect, useState, useRef, MutableRefObject } from 'react';
import { AnimationConfig } from '../AnimationConfig';
import { Link, navigate } from 'gatsby';
import { useTransformSnapshot } from '../ProjectCard/ProjectCardTransition';
import ProgressRing from '../ProgressRing';

type Props = {
  target: string;
  children: React.ReactNode;
};

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

// RELATIVE TO SCREEN SIZE
const HINT_VERTICAL_POSITION = 0.33;
const SCROLL_RUNWAY_SIZE = 1.5;
const LAST_CONTENT_PADDING = '10rem';

function ResistiveScrollLink({ children, target }: Props) {
  const buildup = useRef(0);
  const contentRef = useRef() as MutableRefObject<HTMLDivElement>;
  const ringControl = useAnimation();
  const showAnimationControl = useAnimation();
  const articleAnimation = useAnimation();
  const [isShowingHint, setIsShowingHint] = useState(false);

  const strokeColor = '#333';
  const radius = 16;
  const stroke = 3;

  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const [contentHeight, setContentHeight] = useState<Number>();

  function updateProgressIndication() {
    const progress = clamp(Math.round(buildup.current * 100), -100, 100);
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    const showTransitionDuration = 15;
    const preStartTimeAmount = 10;
    const showProgress = clamp(
      (progress + preStartTimeAmount) / showTransitionDuration,
      0,
      1,
    );

    showAnimationControl.set({
      opacity: showProgress,
      // scale: showProgress * 0.05 + 0.95,
    });
    ringControl.set({
      strokeDashoffset: strokeDashoffset,
    });

    if (progress === 100) {
      navigate(target);
    }
  }

  useEffect(() => {
    if (isShowingHint) {
      const bounds = contentRef.current.getBoundingClientRect();

      setContentHeight(bounds.height);
      articleAnimation.set({
        position: 'fixed',
        left: 0,
        right: 0,
        top: -(
          bounds.height -
          window.innerHeight * (1 - HINT_VERTICAL_POSITION)
        ),
        // y: progress > 0 ? 1 - progress : 0,
      });
    } else {
      articleAnimation.set({
        position: 'relative',
        top: 0,
        // y: progress > 0 ? 1 - progress : 0,
      });
      setContentHeight(null);
    }
  }, [isShowingHint]);

  // Handle buildup after scroll
  useEffect(() => {
    let timer;

    const handleScroll = (e: WheelEvent) => {
      // if (e.deltaY < scrollTollerance) return;

      // half a screen a build up runway
      const showHintOffset = window.innerHeight * (1 - HINT_VERTICAL_POSITION);
      const buildUpLength = window.innerHeight * SCROLL_RUNWAY_SIZE;

      const currentScrollProgress = window.innerHeight + window.scrollY;
      const buildUpOffest =
        1 -
        (document.body.offsetHeight - currentScrollProgress) / buildUpLength;

      if (buildUpOffest > 0) {
        // scroll
        setIsShowingHint(true);
      } else {
        setIsShowingHint(false);
      }
      buildup.current = buildUpOffest;
      updateProgressIndication();
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  return (
    <>
      <div style={{ height: contentHeight ? `${contentHeight}px` : 'auto' }} />
      <motion.div
        animate={articleAnimation}
        ref={contentRef}
        style={{
          paddingBottom: LAST_CONTENT_PADDING,
        }}
      >
        {children}
      </motion.div>
      <div
        style={{
          height: `${SCROLL_RUNWAY_SIZE * 100}vh`,
          marginTop: `${HINT_VERTICAL_POSITION * 100}vh`,
        }}
      >
        <Link
          to="/"
          style={{
            position: 'fixed',
            top: `${(1 - HINT_VERTICAL_POSITION) * 100}vh`,
            left: 0,
            right: 0,
            pointerEvents: isShowingHint ? 'all' : 'none',
            color: '#000',
          }}
          className="main-grid full-width"
        >
          <div className="main-grid__full-content">
            <motion.div
              // animate={{
              //   opacity: isShowingHint ? 1 : 0,
              //   scale: isShowingHint ? 1 : 0.95,
              // }}

              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                // alignItems: 'center',
                justifyContent: 'center',
              }}
              animate={showAnimationControl}
              initial={{ opacity: 0 }}
              exit={{
                opacity: 0,
                transition: {
                  duration: AnimationConfig.FAST,
                  ease: AnimationConfig.EASING,
                },
              }}
            >
              <div>
                <div className="label">Continue scrolling</div>
                <h4>Back to Works</h4>
              </div>
              <svg
                height={radius * 2}
                width={radius * 2}
                style={{ transform: 'rotate(-90deg)', display: 'block' }}
              >
                <motion.circle
                  stroke={strokeColor}
                  fill="transparent"
                  strokeWidth={stroke}
                  strokeDasharray={circumference + ' ' + circumference}
                  stroke-width={stroke}
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                  animate={ringControl}
                  initial={{ strokeDashoffset: 0 }}
                />
                <motion.circle
                  stroke={strokeColor}
                  fill="transparent"
                  strokeWidth={stroke}
                  strokeDasharray={circumference + ' ' + circumference}
                  stroke-width={stroke}
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                  opacity={0.2}
                />
              </svg>
            </motion.div>
          </div>
        </Link>
      </div>
    </>
  );
}

export default ResistiveScrollLink;
