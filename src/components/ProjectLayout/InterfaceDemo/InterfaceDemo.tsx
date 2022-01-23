import React, { createContext, useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import ProgressRing from '../../ProgressRing';
import { useCursorCustomState, CustomStates } from '../../Cursor/Cursor';
import './InterfaceDemo.scss';
import { AnimationConfig } from '../../AnimationConfig';

interface Props {
  url: string;
  label?: string;
  autoplay?: boolean;
  disableAutoPause?: boolean;
  noPadding?: boolean;
  children: React.ReactChildren;
}

const INTERSECTION_RATIO_THRESHOLD = 0.5;

interface Position {
  x: number;
  y: number;
}

const InterfaceAnnotationContext = React.createContext({
  showHighlight: (timecode: number, position: Position) => {},
});
export const useAnnotation = () => React.useContext(InterfaceAnnotationContext);

export const InterfaceDemo = ({
  label,
  url,
  autoplay,
  noPadding,
  children,
  disableAutoPause,
}: Props) => {
  const playerRef = useRef<HTMLVideoElement>();
  const [isViewing, setIsViewing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [cursorCustomState, , setCursorCustomState] = useCursorCustomState();

  const annotationControl = useAnimation();

  const showHighlight = (timecode: number, position: Position) => {
    const playerWidth = playerRef.current.clientWidth;
    const playerHeight = playerRef.current.clientHeight;
    const vidWidth = playerRef.current.videoWidth;
    const vidHeight = playerRef.current.videoHeight;

    // scroll into view if out of view
    const vidRect = playerRef.current.getBoundingClientRect();
    const threshold = 0;
    const offsetTop = 72;
    if (vidRect.top < threshold)
      window.scrollTo({
        top: window.scrollY + vidRect.top - offsetTop,
        behavior: 'smooth',
      });

    // jump to second
    playVideo();
    playerRef.current.currentTime = timecode;

    // highlight portion
    annotationControl.set({
      opacity: 1,
      // top: (playerHeight * box.top) / vidHeight,
      // right: (playerWidth * box.right) / vidWidth,
      // bottom: (playerHeight * box.bottom) / vidHeight,
      // left: (playerWidth * box.left) / vidWidth,
      background: `radial-gradient(circle at ${
        (playerWidth * position.x) / vidWidth
      }px ${
        (playerHeight * position.y) / vidHeight
      }px, rgba(255,255,255,0) 0%, rgba(255,255,255,.8) 50%, rgba(255,255,255,1) 100%`,
    });
    annotationControl.start({
      opacity: 0,
      transition: {
        duration: 1,
      },
    });
  };

  const replayFromBeginning = () => {
    playerRef.current.currentTime = 0;
    playVideo();
  };

  const playVideo = () => {
    playerRef.current
      .play()
      .catch(() => console.log(`interrupted play request for ${url}`));
    setIsPlaying(true);
  };

  const pauseVideo = () => {
    playerRef.current.pause();
    setIsPlaying(false);
  };

  useEffect(() => {
    if (!isViewing && !disableAutoPause) {
      pauseVideo();
    } else {
      if (autoplay !== false) {
        replayFromBeginning();
      }
    }
  }, [isViewing, disableAutoPause]);

  // update the progress when the video is playing
  useEffect(() => {
    const handleTimeUpdate = () => {
      setVideoProgress(
        (playerRef.current.currentTime / playerRef.current.duration) * 100,
      );
    };
    playerRef.current.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      if (playerRef.current)
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
      if (playerRef.current) observer.unobserve(playerRef.current);
    };
  }, [playerRef.current]);

  const handlePlayerClick = () => {
    if (!disableAutoPause && !isViewing) return;

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
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setCursorCustomState(CustomStates.NONE);
    setIsHovering(false);
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
    <>
      <motion.div
        className={
          noPadding === true ? containerWithoutPadding : containerWithPadding
        }
        initial={{ opacity: 0.1 }}
        animate={{ opacity: disableAutoPause || isViewing ? 1 : 0.1 }}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        <div className="progress-ring-container">
          <motion.div
            style={{ marginRight: '.25rem' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: isHovering ? 0 : '5.25rem' }}
            transition={{
              duration: AnimationConfig.FAST,
              easings: AnimationConfig.EASING,
            }}
          >
            <ProgressRing progress={videoProgress} strokeColor="#282828" />
          </motion.div>
          <motion.button
            onClick={handleRestartClick}
            className="disableCursorColorChange"
            style={{ filter: 'grayscale(100%)' }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: isHovering ? 1 : 0,
              x: isHovering ? 0 : '5rem',
            }}
            whileHover={{
              filter: 'grayscale(0%)',
              // opacity: 1,
            }}
            transition={{
              duration: AnimationConfig.FAST,
              easings: AnimationConfig.EASING,
            }}
          >
            <img src="/img/icons/replay.svg" alt="replay icon" />
            Replay
          </motion.button>
        </div>
        <video
          src={url}
          autoPlay={true}
          muted={true}
          preload="auto"
          loop
          disablePictureInPicture
          ref={playerRef}
          onClick={handlePlayerClick}
        />
        <motion.div
          className="interface-annotation-highlight"
          animate={annotationControl}
        />
      </motion.div>
      <InterfaceAnnotationContext.Provider
        value={{ showHighlight: showHighlight }}
      >
        {label && <h5 className="main-grid__primary-col">{label}</h5>}
        {children && <div className="main-grid__secondary-col">{children}</div>}
      </InterfaceAnnotationContext.Provider>
    </>
  );
};
