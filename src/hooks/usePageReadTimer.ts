import { useRef, useEffect, useState } from 'react';
import useGoogleAnalyticsEvent from './useGoogleAnalyticsEvent';
import { useScrollTracker } from 'react-scroll-tracker';

function usePageReadTimer() {
  const logGAEvent = useGoogleAnalyticsEvent('case-study-read');

  const beginTimeInMilliSec = useRef(new Date().getTime());
  const getElapsedTime = () => {
    return new Date().getTime() - beginTimeInMilliSec.current;
  };

  const [maxScrollDepth, setMaxScrolLDepth] = useState(0);

  const scrollTracker = useScrollTracker(
    [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    ({ scrollY }) => {
      setMaxScrolLDepth(scrollY);
    },
  );

  useEffect(() => {
    return () => {
      logGAEvent({
        readTime: millSecToMinuteString(getElapsedTime()),
        scrollDepth: maxScrollDepth,
        pageURL: window.location.pathname,
      });
    };
  }, []);
}

function millSecToMinuteString(millsec) {
  let seconds = millsec / 1000;
  let minutes = Math.floor(seconds / 60);

  seconds = seconds - minutes * 60;

  return `${minutes}:${seconds}`;
}

export default usePageReadTimer;
