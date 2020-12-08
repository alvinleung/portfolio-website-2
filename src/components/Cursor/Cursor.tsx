import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { useLocation } from '@reach/router';

import './Cursor.scss';
import { AnimationConfig } from '../AnimationConfig';

const config = {
  width: 20,
  hoverColor: 'rgba(0,0,255, .8)',
  normalColor: 'rgba(0,0,000, .4)',
};

export default function Cursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(true);
  const [mousedown, setMouseDown] = useState(false);

  const handleMouseMove = (e: MouseEvent) => {
    setHidden(false);
    setMousePos({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseEnter = () => {
    setHidden(false);
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
  const hideCursorForTouchScreen = () => {
    document.body.removeEventListener('mouseenter', handleMouseEnter);
    document.body.removeEventListener('mouseleave', handleMouseLeave);
    document.body.removeEventListener('mousedown', handleMouseDown);
    document.body.removeEventListener('mouseup', handleMouseUp);
    setHidden(true);
  };

  useEffect(() => {
    document.body.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseenter', handleMouseEnter);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mousedown', handleMouseDown);
    document.body.addEventListener('mouseup', handleMouseUp);
    // for canceling touch
    document.body.addEventListener('touchend', hideCursorForTouchScreen);
    document.body.addEventListener('touchstart', hideCursorForTouchScreen);

    return () => {
      document.body.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mousedown', handleMouseDown);
      document.body.removeEventListener('mouseup', handleMouseUp);
      // for canceling touch
      document.body.removeEventListener('touchend', hideCursorForTouchScreen);
      document.body.removeEventListener('touchstart', hideCursorForTouchScreen);
    };
  }, []);

  // for link hovering effect
  const location = useLocation();
  const [linkHovered, setLinkHovered] = useState(false);

  // for link effect
  useEffect(() => {
    const allAnchorElements = document.querySelectorAll('a');
    const handleLinkMouseOver = () => {
      setLinkHovered(true);
    };
    const handleLinkMouseOut = () => {
      setLinkHovered(false);
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

  const getScale = () => {
    if (hidden) return 0;
    if (mousedown) return 0.9;
    if (linkHovered) return 1.2;
    return 1;
  };

  return (
    <motion.div
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        x: mousePos.x - config.width / 2,
        y: mousePos.y - config.width / 2,
        width: config.width,
        height: config.width,
        borderRadius: config.width,
        // border: '2px solid #000',
        zIndex: 100000,
      }}
      animate={{
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
