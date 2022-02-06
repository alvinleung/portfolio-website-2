import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import './VideoPlayer.scss';
import { CustomStates, useCursorCustomState } from '@/components/Cursor/Cursor';
import { AnimationConfig } from '@/components/AnimationConfig';
import measureElement from '@/hooks/measureElement';

interface Props {
  // 0 to 1
  currentProgress: number;
  onScrub: (progress: number) => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

export default function ProgressBar({
  onScrub,
  currentProgress,
  onMouseEnter,
  onMouseLeave,
}: Props) {
  const [scrubMeasurement, scrubRef] = measureElement<HTMLDivElement>([]);

  const [previewProgress, setPreviewProgress] = useState(0);

  const [isHovering, setIsHovering] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);

  const calculateMouseProgress = (e: React.MouseEvent) => {
    const mouseX = e.clientX;
    const mouseOffset = mouseX - scrubMeasurement.x;
    const progress = mouseOffset / scrubMeasurement.width;
    const clampedProgress = clamp(progress, 0, 1);

    return clampedProgress;
  };

  useEffect(() => {
    function handleMouseMove(e) {
      if (!isHovering) return;

      const currentProgress = calculateMouseProgress(e);
      setPreviewProgress(currentProgress);

      if (isScrubbing) onScrub(currentProgress);
    }

    const handleScrubEnd = (e: MouseEvent) => {
      setIsScrubbing(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleScrubEnd);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleScrubEnd);
    };
  }, [isScrubbing, isHovering]);

  const handleScrubBegin = (e: React.MouseEvent) => {
    setIsScrubbing(true);
    onScrub(calculateMouseProgress(e));
  };

  return (
    <>
      <div className="video-shade" />
      <div
        className="video-progress-container"
        onMouseEnter={(e) => {
          setIsHovering(true);
          onMouseEnter && onMouseEnter(e);
        }}
        onMouseLeave={(e) => {
          setIsHovering(false);
          onMouseLeave && onMouseLeave(e);
        }}
        onMouseDown={handleScrubBegin}
      >
        <motion.div
          className="video-progress"
          ref={scrubRef}
          animate={{
            height: isHovering ? '0.3rem' : '0.1rem',
            transition: {
              ease: AnimationConfig.EASING,
              duration: AnimationConfig.NORMAL,
            },
          }}
        >
          <motion.div
            className="video-progress__progress"
            animate={{
              width: `${currentProgress * 100}%`,
              transition: {
                ease: 'linear',
                duration: 0.03,
              },
            }}
          />
          <motion.div
            className="video-progress__preview"
            animate={{
              opacity: isHovering ? 1 : 0,
              width: `${previewProgress * 100}%`,
              transition: {
                ease: 'linear',
                duration: 0.03,
              },
            }}
          >
            <motion.div
              className="video-progress__preview-head"
              animate={{
                scale: isHovering ? 3 : 0,
                transition: {
                  ease: AnimationConfig.EASING,
                  duration: AnimationConfig.NORMAL,
                },
              }}
            ></motion.div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
