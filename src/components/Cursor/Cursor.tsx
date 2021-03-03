import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

import { useLocation } from '@reach/router';

import './Cursor.scss';
import { AnimationConfig } from '../AnimationConfig';
import measureElement from '@/hooks/measureElement';

const config = {
  width: 20,
  hoverColor: 'rgba(0,0,255, .9)',
  normalColor: 'rgba(0,0,255, .9)',
  pressedColor: 'rgba(0,0,255, .2)',
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

  const [customState, useCustomState] = useState();

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
  const location = useLocation();
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
  }, [location]);

  // for hovering paragraph effect
  const [isHoveringParagraph, setIsHoveringParagraph] = useState(false);
  const [targetParagraphFontSize, setTargetParagraphFontSize] = useState('');
  useEffect(() => {
    const allParagraphElements = document.querySelectorAll(
      'p, h1, h2, h3, h4, h5',
    );

    const handleParagraphMouseOver = (e: MouseEvent) => {
      setIsHoveringParagraph(true);
      const style = window.getComputedStyle(e.target as HTMLParagraphElement);
      setTargetParagraphFontSize(style.fontSize);
    };
    const handleParagraphMouseOut = (e: MouseEvent) => {
      setIsHoveringParagraph(false);
    };

    allParagraphElements.forEach((el) => {
      el.addEventListener('mouseover', handleParagraphMouseOver);
      el.addEventListener('mouseout', handleParagraphMouseOut);
    });

    return () => {
      allParagraphElements.forEach((el) => {
        el.removeEventListener('mouseover', handleParagraphMouseOver);
        el.removeEventListener('mouseout', handleParagraphMouseOut);
      });
    };
  }, [location]);

  const DEFAULT_SCALE = 1;
  const MOUSEDOWN_SCALE = 0.9;
  const LINK_HOVER_SCALE = 1.2;
  const LINK_MOUSEDOWN_SCALE = 1.1;

  const getScale = () => {
    if (hidden) return 0;
    if (linkHovered) {
      if (mousedown) return LINK_MOUSEDOWN_SCALE;
      return LINK_HOVER_SCALE;
    }
    if (mousedown) return MOUSEDOWN_SCALE;
    return DEFAULT_SCALE;
  };

  // determine the dimension of the cursor
  const textSelectCursorAppearence = (() => {
    if (hoveredElementMeasurement)
      return {
        width: hoveredElementMeasurement.width,
        height: hoveredElementMeasurement.height,
      };

    if (!isHoveringParagraph)
      return {
        width: config.width,
        height: config.width,
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
        x: hoveredElementMeasurement.x + dampenDistX,
        y: hoveredElementMeasurement.y + dampenDistY,
      };
    }

    return {
      x: mousePos.x - textSelectCursorAppearence.width / 2,
      y: mousePos.y - textSelectCursorAppearence.height / 2,
    };
  })();

  return (
    <motion.div
      style={{
        originX: 0.5,
        originY: 0.5,
        position: 'fixed',
        pointerEvents: 'none',
        x: cursorPosition.x,
        y: cursorPosition.y,
        width: hoveredElementMeasurement
          ? hoveredElementMeasurement.width
          : config.width,
        height: hoveredElementMeasurement
          ? hoveredElementMeasurement.height
          : config.width,
        border: `2px solid ${config.normalColor}`,
        zIndex: 100000,
        // mixBlendMode: 'difference',
      }}
      initial={{
        borderRadius: config.width,
      }}
      animate={{
        // x: hoveredElementMeasurement ? cursorPosition.x : null,
        // y: hoveredElementMeasurement ? cursorPosition.y : null,

        borderRadius: hoveredElementMeasurement ? 4 : config.width,
        opacity: hidden ? 0 : 1,
        scale: getScale(),
        borderColor: hoveredElementMeasurement
          ? config.hoverColor
          : config.normalColor,
        backgroundColor: mousedown
          ? config.pressedColor
          : 'rgba(255,255,255,0)',

        ...(textSelectCursorAppearence !== null && textSelectCursorAppearence),
      }}
      transition={{
        duration: AnimationConfig.VERY_FAST,
        easing: AnimationConfig.EASING,
      }}
    ></motion.div>
  );
}
