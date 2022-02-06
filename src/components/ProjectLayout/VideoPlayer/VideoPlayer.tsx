import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { CustomStates, useCursorCustomState } from '@/components/Cursor/Cursor';
import { AnimationConfig } from '@/components/AnimationConfig';
import ProgressBar from './ProgressBar';

interface Props {
  url: string;
  caption?: string;
  autoplay?: boolean;
  muted?: boolean;
  disableAutoPause?: boolean;
  noPadding?: boolean;
  children: React.ReactChildren;
  isDarkContent?: boolean;
}

const INTERSECTION_RATIO_THRESHOLD = 0.5;

interface Position {
  x: number;
  y: number;
}

export const VideoPlayer = ({
  url,
  autoplay,
  noPadding,
  children,
  caption,
  muted,
  disableAutoPause,
  isDarkContent = true,
}: Props) => {
  const playerRef = useRef<HTMLVideoElement>();
  const [isViewing, setIsViewing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringProgress, setIsHoveringProgress] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const { cursorCustomState, setCursorCustomState, setIsDarkCursorContext } =
    useCursorCustomState();

  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // auto hide player bar
  const [isActive, setIsActive] = useState(true);
  const mouseInactiveTimeout = 1; // 1 second
  const activeTimeout = useRef() as React.MutableRefObject<any>;
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isActive) setIsActive(true);
    if (activeTimeout.current !== null) clearTimeout(activeTimeout.current);
    activeTimeout.current = setTimeout(
      () => setIsActive(false),
      mouseInactiveTimeout * 1000,
    );
  };

  const handleUserScrub = (progress: number) => {
    playerRef.current.currentTime = playerRef.current.duration * progress;
    setVideoProgress(progress);
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
      if (autoplay !== false && muted) {
        replayFromBeginning();
      }
    }
  }, [isViewing, disableAutoPause]);

  // update the progress when the video is playing
  useEffect(() => {
    const handleTimeUpdate = () => {
      setVideoProgress(
        playerRef.current.currentTime / playerRef.current.duration,
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

  const getPlayingCursorState = () =>
    isPlaying ? CustomStates.STOP : CustomStates.PLAY;

  useEffect(() => {
    if (!isViewing || !isHovering) {
      // default, reset to default state
      setCursorCustomState(CustomStates.NONE);
      setIsDarkCursorContext(false);
      return;
    }

    if (isHoveringProgress) {
      setCursorCustomState(CustomStates.HIDDEN);
      setIsDarkCursorContext(isDarkContent);
      return;
    }

    if (isHovering) {
      setCursorCustomState(getPlayingCursorState());
      setIsDarkCursorContext(isDarkContent);
      return;
    }
  }, [isViewing, isHovering, isHoveringProgress]);

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

  // reveal hovering play hint
  useEffect(() => {
    // only show hover as an hint for play
    if (!isHovering) return;

    const handleMouseMove = (e: MouseEvent) => {
      const bounds = playerRef.current.getBoundingClientRect();
      setMouseOffset({
        x: e.clientX - bounds.x,
        y: e.clientY - bounds.y,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHovering]);

  const hasPlayerPlayed =
    playerRef.current && playerRef.current.currentTime !== 0 ? true : false;

  const containerWithPadding =
    'interface-demo display-figure main-grid__full-width';
  const containerWithoutPadding =
    'interface-demo display-figure display-figure--no-padding main-grid__full-width';

  return (
    <figure
      className={
        noPadding === true ? containerWithoutPadding : containerWithPadding
      }
    >
      <motion.div
        className={'video-container'}
        initial={{ opacity: 0.1 }}
        animate={{ opacity: disableAutoPause || isViewing ? 1 : 0.1 }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
      >
        <motion.div
          animate={{
            opacity:
              (isHovering && isActive) || (isViewing && !isPlaying) ? 1 : 0,
            transition: {
              ease: AnimationConfig.EASING,
              duration: 1,
            },
          }}
        >
          <ProgressBar
            currentProgress={videoProgress}
            onScrub={handleUserScrub}
            onMouseEnter={() => setIsHoveringProgress(true)}
            onMouseLeave={() => setIsHoveringProgress(false)}
          />
        </motion.div>
        <video
          src={url}
          preload="auto"
          loop
          disablePictureInPicture={true}
          ref={playerRef}
          onClick={handlePlayerClick}
        />
      </motion.div>
      {caption && <figcaption>{caption}</figcaption>}
      <motion.div
        className="label"
        style={{
          pointerEvents: 'none',
          zIndex: 1000,
          position: 'absolute',
          top: 0,
          left: 0,
          color: '#FFF',
        }}
        animate={{
          x: mouseOffset.x - 60,
          y: mouseOffset.y + 40,
          opacity:
            isHovering && !isPlaying && isViewing && !isHoveringProgress
              ? 1
              : 0,

          transition: {
            duration: 0.4,
            ease: AnimationConfig.EASING,
          },
        }}
      >
        Play with Audio
      </motion.div>
    </figure>
  );
};
