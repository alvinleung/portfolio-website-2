import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { CustomStates, useCursorCustomState } from '@/components/Cursor/Cursor';
import { AnimationConfig } from '@/components/AnimationConfig';
import ProgressBar from './ProgressBar';

interface Props {
  src: string;
  caption?: string;
  autoPlay?: boolean;
  hasSound?: boolean;
  disableAutoPause?: boolean;
  noPadding?: boolean;
  loop?: boolean;
  children: React.ReactChildren;
  isDarkContent?: boolean;
}

const INTERSECTION_RATIO_THRESHOLD = 0.5;

interface Position {
  x: number;
  y: number;
}

export const VideoPlayer = ({
  src,
  noPadding,
  children,
  caption,
  autoPlay,
  loop,
  hasSound = false,
  disableAutoPause,
  isDarkContent = true,
}: Props) => {
  const playerRef = useRef<HTMLVideoElement>();

  const needUnmute = hasSound;
  const [hasUnmuted, setHasUnmuted] = useState(!needUnmute);
  console.log(needUnmute);

  const [isMuted, setIsMuted] = useState(hasSound);
  const [isViewing, setIsViewing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringProgress, setIsHoveringProgress] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const { cursorCustomState, setCursorCustomState, setIsDarkCursorContext } =
    useCursorCustomState();

  const [mouseOffset, setMouseOffset] = useState({
    x: 0,
    y: 0,
    fromCenterX: 0,
    fromCenterY: 0,
  });

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
      .catch(() => console.log(`interrupted play request for ${src}`));
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
      if (autoPlay !== false) {
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
    if (!hasUnmuted) {
      setIsMuted(false);
      setHasUnmuted(true);
      replayFromBeginning();
      return;
    }

    if (!disableAutoPause && !isViewing) return;

    if (!isPlaying) {
      playVideo();
      return;
    }

    pauseVideo();
  };

  const getPlayingCursorState = () =>
    isPlaying && hasUnmuted ? CustomStates.STOP : CustomStates.PLAY;

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
  }, [isViewing, isHovering, isPlaying, hasUnmuted, isHoveringProgress]);

  const handleRestartClick = () => {
    replayFromBeginning();
  };

  // reveal hovering play hint
  useEffect(() => {
    // only show hover as an hint for play
    if (!isHovering) return;

    // capture the dimension on hover
    const bounds = playerRef.current.getBoundingClientRect();
    const initialScrollX = window.scrollX;
    const initialScrollY = window.scrollY;

    const handleMouseMove = (e: MouseEvent) => {
      const playerPosX = bounds.x + (initialScrollX - window.scrollX);
      const playerPosY = bounds.y + (initialScrollY - window.scrollY);

      const centerX = e.clientX - (playerPosX + bounds.width / 2);
      const centerY = e.clientY - (playerPosY + bounds.height / 2);
      const x = e.clientX - playerPosX;
      const y = e.clientY - playerPosY;

      setMouseOffset({
        x: x,
        y: y,
        fromCenterX: centerX,
        fromCenterY: centerY,
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

  // console.log(hasUnmuted);

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
        <ProgressBar
          duration={playerRef.current && playerRef.current.duration}
          currentProgress={videoProgress}
          onScrub={handleUserScrub}
          onMouseEnter={() => setIsHoveringProgress(true)}
          onMouseLeave={() => setIsHoveringProgress(false)}
          isShowing={
            hasUnmuted &&
            isViewing &&
            ((isHovering && isActive) || (isViewing && !isPlaying))
          }
        />
        <motion.div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            zIndex: 100,
            pointerEvents: 'none',
            backgroundColor: 'rgba(0,0,0,.6)',
          }}
          animate={{
            opacity: isHovering && !hasUnmuted ? 1 : 0,
            transition: {
              duration: 0.4,
              ease: AnimationConfig.EASING,
            },
          }}
        ></motion.div>
        <div
          style={{
            overflow: 'hidden',
          }}
        >
          <motion.video
            src={src}
            preload="auto"
            loop={loop}
            disablePictureInPicture={true}
            ref={playerRef}
            onClick={handlePlayerClick}
            autoPlay={autoPlay}
            muted={isMuted}
            animate={{
              x:
                isHovering && ((needUnmute && !hasUnmuted) || !isPlaying)
                  ? mouseOffset.fromCenterX * 0.03
                  : 0,
              y:
                isHovering && ((needUnmute && !hasUnmuted) || !isPlaying)
                  ? mouseOffset.fromCenterY * 0.03
                  : 0,
              scale:
                isHovering && ((needUnmute && !hasUnmuted) || !isPlaying)
                  ? 1.05
                  : 1,
              transition: {
                duration: 0.4,
                ease: AnimationConfig.EASING,
              },
            }}
          />
        </div>
      </motion.div>
      {caption && <figcaption>{caption}</figcaption>}
      {needUnmute && (
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
            x: mouseOffset.x - 20,
            y: mouseOffset.y + 30,
            opacity:
              isHovering && isViewing && !hasUnmuted && !isHoveringProgress
                ? 1
                : 0,

            transition: {
              duration: 0.4,
              ease: AnimationConfig.EASING,
            },
          }}
        >
          Watch
        </motion.div>
      )}
    </figure>
  );
};
