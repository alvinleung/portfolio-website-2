import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

import { useLocation } from '@reach/router';

import './Cursor.scss';
import { AnimationConfig } from '../AnimationConfig';
import measureElement from '@/hooks/measureElement';

const config = {
  width: 20,
  hoverColor: 'rgba(0,0,000, .1)',
  normalColor: 'rgba(0,0,000, .4)',
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
    document.body.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseenter', handleMouseEnter);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mousedown', handleMouseDown);
    document.body.addEventListener('mouseup', handleMouseUp);
  };

  const hideCursorForTouchScreen = () => {
    addAllMouseEventListeners();
    isUsingTouch.current = true;
    setHidden(true);
  };

  const showCursorForMouseInput = () => {
    removeAllMouseEventListeners();
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
    const handleLinkMouseOver = (e: MouseEvent) => {
      setLinkHovered(true);

      // only use the hover effect links
      if (!(e.target instanceof HTMLAnchorElement)) return;

      const source = e.target as HTMLAnchorElement;
      const measurement = source.getBoundingClientRect();
      setHoveredElementMeasurement({
        x: measurement.x,
        y: measurement.y,
        width: measurement.width,
        height: measurement.height,
      });
      // e.preventDefault();
      // e.stopPropagation();
    };
    const handleLinkMouseOut = (e: MouseEvent) => {
      setLinkHovered(false);
      setHoveredElementMeasurement(null);
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
      x: mousePos.x - config.width / 2,
      y: mousePos.y - config.width / 2,
    };
  })();

  return (
    <motion.div
      style={{
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
        // border: '2px solid #000',
        zIndex: hoveredElementMeasurement ? -1 : 100000,
      }}
      animate={{
        // x: hoveredElementMeasurement ? cursorPosition.x : null,
        // y: hoveredElementMeasurement ? cursorPosition.y : null,

        borderRadius: hoveredElementMeasurement ? 4 : config.width,
        opacity: hidden ? 0 : 1,
        scale: getScale(),
        backgroundColor: linkHovered ? config.hoverColor : config.normalColor,
      }}
      transition={{
        duration: AnimationConfig.VERY_FAST,
        easing: AnimationConfig.EASING,
      }}
    />
  );
}
