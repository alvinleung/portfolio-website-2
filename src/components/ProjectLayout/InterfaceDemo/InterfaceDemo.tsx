import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ProgressRing from '../ProgressRing';
import { useCursorCustomState, CustomStates } from '../Cursor/Cursor';
import './InterfaceDemo.scss';
import { AnimationConfig } from '../AnimationConfig';

interface Props {
  url: string;
  autoplay?: boolean;
  noPadding?: boolean;
}

const INTERSECTION_RATIO_THRESHOLD = 0.5;

export const InterfaceDemo = ({ url, autoplay, noPadding }) => {
  const playerRef = useRef<HTMLVideoElement>();
  const [isViewing, setIsViewing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [cursorCustomState, , setCursorCustomState] = useCursorCustomState();

  const replayFromBeginning = () => {
    playerRef.current.currentTime = 0;
    playVideo();
  };

  const playVideo = () => {
    playerRef.current.play();
    setIsPlaying(true);
  };

  const pauseVideo = () => {
    playerRef.current.pause();
    setIsPlaying(false);
  };

  useEffect(() => {
    if (!isViewing) {
      pauseVideo();
    } else {
      if (autoplay !== false) {
        replayFromBeginning();
      }
    }
  }, [isViewing]);

  // update the progress when the video is playing
  useEffect(() => {
    const handleTimeUpdate = () => {
      setVideoProgress(
        (playerRef.current.currentTime / playerRef.current.duration) * 100,
      );
    };
    playerRef.current.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      playerRef.current.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  // setup intersection observer for auto playing video when user scroll to the page
  useEffect(() => {
    const options = {
      rootMargin: '0px 0px 0px 0px',
      threshold: [0, 0.5, 1],
      // threshold: [
      //   (1 - INTERSECTION_RATIO_THRESHOLD) / 2 + 0.01,
      //   1 - (1 - INTERSECTION_RATIO_THRESHOLD) / 2 - 0.01,
      // ],
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
    if (!isViewing) return;

    if (!isPlaying) {
      playVideo();
      return;
    }
    pauseVideo();
  };

  const handleMouseOver = () => {
    // show different cursor icon base on whether the video is playing
    const showCursorState = isPlaying ? CustomStates.STOP : CustomStates.PLAY;
    setCursorCustomState(showCursorState);
  };

  const handleMouseOut = () => {
    setCursorCustomState(CustomStates.NONE);
  };

  useEffect(() => {
    // only change the cursor custom state when the user is hovering
    if (cursorCustomState === CustomStates.NONE) return;

    // set icon to opposite staste of video play state
    // to indicate what "will" happen after clicking on video
    if (isPlaying) {
      setCursorCustomState(CustomStates.STOP);
    } else {
      setCursorCustomState(CustomStates.PLAY);
    }
  }, [isPlaying]);

  const handleRestartClick = () => {
    replayFromBeginning();
  };

  const hasPlayerPlayed =
    playerRef.current && playerRef.current.currentTime !== 0 ? true : false;

  const containerWithPadding =
    'interface-demo display-figure main-grid__full-width';
  const containerWithoutPadding =
    'interface-demo display-figure display-figure--no-padding main-grid__full-width';

  return (
    <motion.div
      className={
        noPadding === true ? containerWithoutPadding : containerWithPadding
      }
      initial={{ opacity: 0.1 }}
      animate={{ opacity: isViewing ? 1 : 0.1 }}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <div className="progress-ring-container">
        <ProgressRing progress={videoProgress} strokeColor="rgba(0,0,0,.2)" />
        <motion.button
          onClick={handleRestartClick}
          style={{ filter: 'grayscale(100%)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: hasPlayerPlayed ? 0.2 : 0 }}
          whileHover={{
            filter: 'grayscale(0%)',
            opacity: 1,
          }}
          transition={{
            duration: AnimationConfig.FAST,
            easings: AnimationConfig.EASING,
          }}
        />
      </div>
      <video
        src={url}
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
