import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion } from 'framer-motion';

import './Cursor.scss';
import { AnimationConfig } from '../AnimationConfig';

const config = {
  width: 20,
  hoverColor: 'rgba(0,0,255, .9)',
  normalColor: 'rgba(0,0,255, .9)',
  pressedColor: 'rgba(0,0,255, .2)',
};

/*
 Using context provider pattern to allow global access to the cursor state
*/

const CUSTOM_STATE_SCALE = 3;
const CUSTOM_STATE_ICON_SCALE = 0.33;

export enum CustomStates {
  NONE,
  REPLAY,
  HORIZONTAL_SLIDE,
}

const CustomStateIcons = {
  [CustomStates.REPLAY]: '/img/cursor/replay-white-18dp.svg',
  [CustomStates.HORIZONTAL_SLIDE]: '/img/cursor/slide-horizontal.svg',
};

export const CursorContext = React.createContext<
  [
    CustomStates, // current
    CustomStates, // previous
    React.Dispatch<React.SetStateAction<CustomStates>>,
  ]
>([null, null, () => {}]);

export const useCursorCustomState = () => useContext(CursorContext);

export const CursorContextProvider = ({ children }) => {
  const [customState, setCustomState] = useState(CustomStates.NONE);
  const previousState = useRef(customState);
  const previousStateCopy = previousState.current;
  if (previousState.current != customState) previousState.current = customState;
  return (
    <CursorContext.Provider
      value={[customState, previousStateCopy, setCustomState]}
    >
      {children}
    </CursorContext.Provider>
  );
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

  const [
    customState,
    previousCustomState,
    setCustomState,
  ] = useCursorCustomState();

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
      setCustomState(CustomStates.NONE);
    };
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
  const [hoveredElementMeasurement, setHoveredElementMeasurement] = useState<
    elmMeasurement
  >();

  // for link effect
  useEffect(() => {
    const allAnchorElements = document.querySelectorAll('a');

    let sourceInitialColor = '';

    const handleLinkMouseOver = (e: MouseEvent) => {
      setLinkHovered(true);

      // only use the hover effect links
      if (!(e.target instanceof HTMLAnchorElement)) return;

      const source = e.target as HTMLAnchorElement;
      const measurement = source.getBoundingClientRect();

      // update the initial source color
      sourceInitialColor = source.style.color;

      setHoveredElementMeasurement({
        x: measurement.x,
        y: measurement.y,
        width: measurement.width,
        height: measurement.height,
      });

      source.style.color = config.hoverColor;
      // e.preventDefault();
      // e.stopPropagation();
    };
    const handleLinkMouseOut = (e: MouseEvent) => {
      setLinkHovered(false);
      setHoveredElementMeasurement(null);

      const source = e.target as HTMLAnchorElement;
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
  const [targetParagraphFontSize, setTargetParagraphFontSize] = useState('');
  useEffect(() => {
    const handleParagraphMouseOver = (e: MouseEvent) => {
      setIsHoveringParagraph(true);
      const style = window.getComputedStyle(e.target as HTMLParagraphElement);
      setTargetParagraphFontSize(style.fontSize);
    };
    const handleParagraphMouseOut = (e: MouseEvent) => {
      setIsHoveringParagraph(false);
    };

    const handleWindowMouseOver = (e: MouseEvent) => {
      if (
        !(e.target instanceof HTMLSpanElement) &&
        !(e.target instanceof HTMLParagraphElement) &&
        !(e.target instanceof HTMLHeadingElement)
      )
        return;

      handleParagraphMouseOver(e);
    };
    const handleWindowMouseOut = (e: MouseEvent) => {
      if (
        !(e.target instanceof HTMLSpanElement) &&
        !(e.target instanceof HTMLParagraphElement) &&
        !(e.target instanceof HTMLHeadingElement)
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
  const LINK_HOVER_SCALE = 1.2;
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
    if (customState !== CustomStates.NONE)
      return {
        width: config.width * CUSTOM_STATE_SCALE,
        height: config.width * CUSTOM_STATE_SCALE,
        borderRadius: config.width * CUSTOM_STATE_SCALE,
      };

    if (hoveredElementMeasurement)
      return {
        width: hoveredElementMeasurement.width,
        height: hoveredElementMeasurement.height,
        borderRadius: 4,
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
        }}
        initial={{
          borderRadius: config.width,
        }}
        animate={{
          // x: hoveredElementMeasurement ? cursorPosition.x : null,
          // y: hoveredElementMeasurement ? cursorPosition.y : null,

          borderRadius: textSelectCursorAppearence.borderRadius,
          opacity: hidden ? 0 : 1,
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
          easing: AnimationConfig.EASING,
        }}
      >
        <motion.img
          // src="/img/cursor/replay-white-18dp.svg"
          src={
            CustomStateIcons[customState] ||
            CustomStateIcons[previousCustomState] ||
            '/img/cursor/empty.png'
          }
          style={{
            width: textSelectCursorAppearence.width * CUSTOM_STATE_ICON_SCALE,
            height: textSelectCursorAppearence.height * CUSTOM_STATE_ICON_SCALE,
          }}
          alt="Cursor icon"
          animate={{
            opacity: customState === CustomStates.NONE ? 0 : 1,
            scale: customState === CustomStates.NONE ? 0 : 1,
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
