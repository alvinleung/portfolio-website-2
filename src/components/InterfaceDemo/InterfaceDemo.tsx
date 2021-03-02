import React, { useEffect, useRef, useState } from 'react';
import './InterfaceDemo.scss';

interface Props {
  url: string;
}

export const InterfaceDemo = (props: Props) => {
  const playerRef = useRef<HTMLVideoElement>();
  const [isPlaying, setIsPlaying] = useState(false);

  const replayFromBeginning = () => {
    playerRef.current.currentTime = 0;
    playerRef.current.play();
  };

  // setup intersection observer for auto playing video when user scroll to the page
  useEffect(() => {
    const options = {
      rootMargin: '0px',
      threshold: 1.0,
    };

    const observationStatusChange: IntersectionObserverCallback = (
      [currentEntry],
      observer,
    ) => {
      if (currentEntry.isIntersecting) {
        // the video is now in view
        replayFromBeginning();
      }
    };
    const observer = new IntersectionObserver(observationStatusChange, options);
    observer.observe(playerRef.current);

    return () => {
      observer.unobserve(playerRef.current);
    };
  }, [playerRef.current]);

  return (
    <div className="interface-demo display-figure  main-grid__full-width">
      <video
        src={props.url}
        autoPlay={true}
        muted={true}
        preload="auto"
        loop
        ref={playerRef}
      />
    </div>
  );
};
