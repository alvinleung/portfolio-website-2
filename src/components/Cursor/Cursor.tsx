import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion } from 'framer-motion';

import './Cursor.scss';
import { AnimationConfig } from '../AnimationConfig';

/**
 *
 *
 * Custom Cursor
 *
 * BEHAVIOUR
 * 1. All clickable interaction highlight will override all the other state modification
 * 2. Mouse button state(mouse down, mouse up etc.) is standalone behaviour unaffected by any states
 * 3. Custom behaviour can be accessed and modified by a shared react context
 *
 */

const config = {
  width: 20,
  hoverColor: 'rgba(40,40,40, 1)',
  normalColor: 'rgba(40,40,40, 1)',
  pressedColor: 'rgba(40,40,40, .2)',
};

/*
 Using context provider pattern to allow global access to the cursor state
*/

const CUSTOM_STATE_SCALE = 2;
const CUSTOM_STATE_ICON_SCALE = 0.5;

export enum CustomStates {
  NONE,
  REPLAY,
  HORIZONTAL_SLIDE,
  PLAY,
  STOP,
  OPEN_FULLSCREEN,
  CLOSE_FULLSCREEN,
  ZOOM_IN,
  ZOOM_OUT,
  CLOSE,
  HIDDEN,
}

const CustomStateIcons = {
  [CustomStates.REPLAY]: '/img/icons/replay.svg',
  [CustomStates.HORIZONTAL_SLIDE]: '/img/icons/slide-horizontal.svg',
  [CustomStates.PLAY]: '/img/icons/play.svg',
  [CustomStates.STOP]: '/img/icons/stop.svg',
  [CustomStates.OPEN_FULLSCREEN]: '/img/icons/fullscreen-open.svg',
  [CustomStates.CLOSE_FULLSCREEN]: '/img/icons/fullscreen-close.svg',
  [CustomStates.ZOOM_IN]: '/img/icons/zoom-in.svg',
  [CustomStates.ZOOM_OUT]: '/img/icons/zoom-out.svg',
  [CustomStates.CLOSE]: '/img/icons/close.svg',
  [CustomStates.NONE]: '/img/icons/empty.png',
};

function preloadCustomStateIcons() {
  Object.values(CustomStateIcons).forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

export const CursorContext = React.createContext<{
  cursorCustomState: CustomStates; // current
  prevCursorCustomState: CustomStates; // previous
  setCursorCustomState: React.Dispatch<React.SetStateAction<CustomStates>>; // set cursor icon aka custom state
  isDarkCursorContext: boolean; // set dark mode
  setIsDarkCursorContext: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  cursorCustomState: CustomStates.NONE,
  prevCursorCustomState: CustomStates.NONE,
  setCursorCustomState: () => {},
  isDarkCursorContext: false,
  setIsDarkCursorContext: () => {},
});

export const useCursorCustomState = () => useContext(CursorContext);

export const CursorContextProvider = ({ children }) => {
  const [customState, setCustomState] = useState(CustomStates.NONE);
  const [isDarkContext, setIsDarkContext] = useState(false);
  const previousState = useRef(customState);
  const previousStateCopy = previousState.current;
  if (previousState.current != customState) previousState.current = customState;
  return (
    <CursorContext.Provider
      value={{
        cursorCustomState: customState,
        prevCursorCustomState: previousStateCopy,
        setCursorCustomState: setCustomState,
        isDarkCursorContext: isDarkContext,
        setIsDarkCursorContext: setIsDarkContext,
      }}
    >
      {children}
    </CursorContext.Provider>
  );
};

// utility for setting hover state in mouse
export const useCursorHoverState = (
  hoveredCustomState: CustomStates,
  isDarkContext: boolean = false,
) => {
  const { setCursorCustomState, setIsDarkCursorContext } =
    useCursorCustomState();
  const [isHovering, setIsHovering] = useState(false);

  // to when the hoveredCustomState chances, make sure the change
  // is reflected on the cursor when hovering

  useEffect(() => {
    if (isHovering) setCursorCustomState(hoveredCustomState);
  }, [hoveredCustomState]);

  const onMouseOver = () => {
    setCursorCustomState(hoveredCustomState);
    setIsDarkCursorContext(isDarkContext);
    setIsHovering(true);
  };

  const onMouseLeave = () => {
    setCursorCustomState(CustomStates.NONE);
    setIsDarkCursorContext(false);
    setIsHovering(false);
  };

  return {
    onMouseOver: onMouseOver,
    onMouseLeave: onMouseLeave,
  };
};

interface elmMeasurement {
  width: number;
  height: number;
  x: number;
  y: number;
}

export default function Cursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [hidden, setHidden] = useState(true);
  const isUsingTouch = useRef(false);
  const [mousedown, setMouseDown] = useState(false);

  const {
    cursorCustomState,
    prevCursorCustomState,
    setCursorCustomState,
    isDarkCursorContext,
  } = useCursorCustomState();

  const handleMouseMove = (e: MouseEvent) => {
    if (!isUsingTouch.current) setHidden(false);
    setMousePos({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseEnter = (e: MouseEvent) => {
    showCursorForMouseInput();
    setHidden(false);
    setMousePos({
      x: e.clientX,
      y: e.clientY,
    });
  };
  const handleMouseLeave = () => {
    setHidden(true);
  };

  const handleMouseDown = () => {
    setMouseDown(true);
  };
  const handleMouseUp = () => {
    setMouseDown(false);
  };

  const addAllMouseEventListeners = () => {
    document.body.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseenter', handleMouseEnter);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mousedown', handleMouseDown);
    document.body.addEventListener('mouseup', handleMouseUp);
  };

  const removeAllMouseEventListeners = () => {
    document.body.removeEventListener('mousemove', handleMouseMove);
    document.body.removeEventListener('mouseenter', handleMouseEnter);
    document.body.removeEventListener('mouseleave', handleMouseLeave);
    document.body.removeEventListener('mousedown', handleMouseDown);
    document.body.removeEventListener('mouseup', handleMouseUp);
  };

  const hideCursorForTouchScreen = () => {
    removeAllMouseEventListeners();
    isUsingTouch.current = true;
    setHidden(true);
  };

  const showCursorForMouseInput = () => {
    addAllMouseEventListeners();
    setHidden(false);
    isUsingTouch.current = false;
  };

  // reset the custom state when page change
  useEffect(() => {
    return () => {
      setCursorCustomState(CustomStates.NONE);
    };
  }, []);

  // preload cursor icons when page load
  useEffect(() => {
    preloadCustomStateIcons();
  }, []);

  useEffect(() => {
    addAllMouseEventListeners();
    // for canceling touch
    document.body.addEventListener('touchend', hideCursorForTouchScreen);
    document.body.addEventListener('touchstart', hideCursorForTouchScreen);

    return () => {
      removeAllMouseEventListeners();
      // for canceling touch
      document.body.removeEventListener('touchend', hideCursorForTouchScreen);
      document.body.removeEventListener('touchstart', hideCursorForTouchScreen);
    };
  }, []);

  // for link hovering effect
  const [linkHovered, setLinkHovered] = useState(false);
  const [hoveredElementMeasurement, setHoveredElementMeasurement] =
    useState<elmMeasurement>();

  // for link effect
  useEffect(() => {
    const allAnchorElements = document.querySelectorAll('a, button');

    let sourceInitialColor = '';

    const handleLinkMouseOver = (e: MouseEvent) => {
      setLinkHovered(true);

      // only use the hover effect links
      if (
        !(e.target instanceof HTMLAnchorElement) &&
        !(e.target instanceof HTMLButtonElement)
      )
        return;

      const source = e.target as HTMLElement;
      const measurement = source.getBoundingClientRect();

      // update the initial source color
      sourceInitialColor = source.style.color;

      setHoveredElementMeasurement({
        x: measurement.x,
        y: measurement.y,
        width: measurement.width,
        height: measurement.height,
      });

      // change source color if the colour is not inverted
      if (!e.target.classList.contains('disableCursorColorChange'))
        source.style.color = config.hoverColor;
      // e.preventDefault();
      // e.stopPropagation();
    };
    const handleLinkMouseOut = (e: MouseEvent) => {
      setLinkHovered(false);
      setHoveredElementMeasurement(null);

      const source = e.target as HTMLElement;
      source.style.color = sourceInitialColor;
    };

    allAnchorElements.forEach((el) => {
      el.addEventListener('mouseover', handleLinkMouseOver);
      el.addEventListener('mouseout', handleLinkMouseOut);
    });
    return () => {
      allAnchorElements.forEach((el) => {
        el.removeEventListener('mouseover', handleLinkMouseOver);
        el.removeEventListener('mouseout', handleLinkMouseOut);
      });
    };
  }, []);

  // for hovering paragraph effect
  const [isHoveringParagraph, setIsHoveringParagraph] = useState(false);
  const [targetParagraphFontSize, setTargetParagraphFontSize] =
    useState('16px');
  useEffect(() => {
    const handleParagraphMouseOver = (e: MouseEvent) => {
      setIsHoveringParagraph(true);
      const style = window.getComputedStyle(e.target as HTMLElement);
      setTargetParagraphFontSize(style.fontSize);
    };
    const handleParagraphMouseOut = (e: MouseEvent) => {
      setIsHoveringParagraph(false);
    };

    const handleWindowMouseOver = (e: MouseEvent) => {
      const tagName = (e.target as HTMLElement).tagName;

      if (
        !(e.target instanceof HTMLSpanElement) &&
        !(e.target instanceof HTMLParagraphElement) &&
        !(e.target instanceof HTMLHeadingElement) &&
        !(tagName === 'EM') &&
        !(tagName === 'STRONG')
      )
        return;

      handleParagraphMouseOver(e);
    };
    const handleWindowMouseOut = (e: MouseEvent) => {
      const tagName = (e.target as HTMLElement).tagName;

      if (
        !(e.target instanceof HTMLSpanElement) &&
        !(e.target instanceof HTMLParagraphElement) &&
        !(e.target instanceof HTMLHeadingElement) &&
        !(tagName === 'EM') &&
        !(tagName === 'STRONG')
      )
        return;

      handleParagraphMouseOut(e);
    };

    window.addEventListener('mouseover', handleWindowMouseOver);
    window.addEventListener('mouseout', handleWindowMouseOut);
    return () => {
      window.removeEventListener('mouseover', handleWindowMouseOver);
      window.removeEventListener('mouseout', handleWindowMouseOut);
    };
  }, []);

  const DEFAULT_SCALE = 1;
  const MOUSEDOWN_SCALE = 0.9;
  const LINK_HOVER_SCALE = 1.25;
  const LINK_MOUSEDOWN_SCALE = 1.1;

  const cursorScale = (() => {
    if (hidden) return 0;
    if (linkHovered) {
      if (mousedown) return LINK_MOUSEDOWN_SCALE;
      return LINK_HOVER_SCALE;
    }
    if (mousedown) return MOUSEDOWN_SCALE;

    return DEFAULT_SCALE;
  })();

  // determine the dimension of the cursor
  const textSelectCursorAppearence = (() => {
    if (hoveredElementMeasurement)
      return {
        width: hoveredElementMeasurement.width,
        height: hoveredElementMeasurement.height,
        borderRadius: 4,
      };

    if (
      cursorCustomState !== CustomStates.NONE &&
      cursorCustomState !== CustomStates.HIDDEN
    )
      return {
        width: config.width * CUSTOM_STATE_SCALE,
        height: config.width * CUSTOM_STATE_SCALE,
        borderRadius: config.width * CUSTOM_STATE_SCALE,
      };

    if (!isHoveringParagraph)
      return {
        width: config.width,
        height: config.width,
        borderRadius: config.width,
      };

    return {
      width: 4,
      height: parseInt(targetParagraphFontSize),
      borderRadius: 4,
    };
  })();

  // calculate the appropriate cursor position every update
  const cursorPosition = (() => {
    if (hoveredElementMeasurement) {
      const elmCenterX =
        hoveredElementMeasurement.x + hoveredElementMeasurement.width / 2;
      const elmCenterY =
        hoveredElementMeasurement.y + hoveredElementMeasurement.height / 2;

      const mouseDistX = mousePos.x - elmCenterX;
      const mouseDistY = mousePos.y - elmCenterY;

      const dampenDistX = mouseDistX * 0.1;
      const dampenDistY = mouseDistY * 0.1;

      return {
        x: elmCenterX + dampenDistX,
        y: elmCenterY + dampenDistY,
      };
    }

    return {
      x: mousePos.x,
      y: mousePos.y,
    };
  })();

  const cursorFillColor = (() => {
    // if (customState === CustomStates.REPLAY) {
    //   return config.hoverColor;
    // }
    return mousedown ? config.pressedColor : 'rgba(255,255,255,0)';
  })();

  return (
    <motion.div
      style={{
        // originX: 0.5,
        // originY: 0.5,
        position: 'fixed',
        pointerEvents: 'none',
        x: cursorPosition.x,
        y: cursorPosition.y,
        zIndex: 100000,
      }}
    >
      <motion.div
        style={{
          x: '-50%',
          y: '-50%',
          border: `2px solid ${config.normalColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: `invert(${isDarkCursorContext ? 100 : 0}%)`,
        }}
        initial={{
          borderRadius: config.width,
        }}
        animate={{
          // x: hoveredElementMeasurement ? cursorPosition.x : null,
          // y: hoveredElementMeasurement ? cursorPosition.y : null,

          borderRadius: textSelectCursorAppearence.borderRadius,
          opacity: hidden || cursorCustomState === CustomStates.HIDDEN ? 0 : 1,
          scale: cursorScale,
          borderColor: hoveredElementMeasurement
            ? config.hoverColor
            : config.normalColor,
          backgroundColor: cursorFillColor,
          width: textSelectCursorAppearence.width,
          height: textSelectCursorAppearence.height,
        }}
        transition={{
          duration: AnimationConfig.VERY_FAST,
          ease: AnimationConfig.EASING_SOFT,
        }}
      >
        <motion.img
          // src="/img/cursor/replay-white-18dp.svg"
          src={
            CustomStateIcons[cursorCustomState] ||
            CustomStateIcons[prevCursorCustomState] ||
            '/img/cursor/empty.png'
          }
          style={{
            width: textSelectCursorAppearence.width * CUSTOM_STATE_ICON_SCALE,
            height: textSelectCursorAppearence.height * CUSTOM_STATE_ICON_SCALE,
          }}
          alt="Cursor icon"
          animate={{
            opacity:
              cursorCustomState === CustomStates.NONE ||
              hoveredElementMeasurement
                ? 0
                : 1,
            scale:
              cursorCustomState === CustomStates.NONE ||
              hoveredElementMeasurement
                ? 0
                : 1,
          }}
          transition={{
            duration: AnimationConfig.FAST,
            easing: AnimationConfig.EASING,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
