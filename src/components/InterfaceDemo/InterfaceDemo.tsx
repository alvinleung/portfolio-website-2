import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './InterfaceDemo.scss';

interface Props {
  url: string;
}

const INTERSECTION_RATIO_THRESHOLD = 0.5;

export const InterfaceDemo = (props: Props) => {
  const playerRef = useRef<HTMLVideoElement>();
  const [isViewing, setIsViewing] = useState(false);

  const replayFromBeginning = () => {
    playerRef.current.currentTime = 0;
    playerRef.current.play();
  };

  const pauseVideo = () => {
    playerRef.current.pause();
  };

  useEffect(() => {
    if (isViewing) {
      replayFromBeginning();
    } else {
      pauseVideo();
    }
  }, [isViewing]);

  // setup intersection observer for auto playing video when user scroll to the page
  useEffect(() => {
    const options = {
      rootMargin: '0px 0px 0px 0px',
      threshold: [
        (1 - INTERSECTION_RATIO_THRESHOLD) / 2 + 0.01,
        1 - (1 - INTERSECTION_RATIO_THRESHOLD) / 2 - 0.01,
      ],
    };

    const observationStatusChange: IntersectionObserverCallback = (
      [currentEntry],
      observer,
    ) => {
      if (currentEntry.intersectionRatio > INTERSECTION_RATIO_THRESHOLD) {
        // the video is now in view
        setIsViewing(true);
      } else {
        // the video is going out of view
        setIsViewing(false);
      }
    };
    const observer = new IntersectionObserver(observationStatusChange, options);
    observer.observe(playerRef.current);

    return () => {
      observer.unobserve(playerRef.current);
    };
  }, [playerRef.current]);

  const handlePlayerClick = () => {
    if (isViewing) replayFromBeginning();
  };

  return (
    <motion.div
      className="interface-demo display-figure  main-grid__full-width"
      initial={{ opacity: 0.1 }}
      animate={{ opacity: isViewing ? 1 : 0.1 }}
    >
      <video
        src={props.url}
        autoPlay={true}
        muted={true}
        preload="auto"
        loop
        ref={playerRef}
        onClick={handlePlayerClick}
      />
    </motion.div>
  );
};
