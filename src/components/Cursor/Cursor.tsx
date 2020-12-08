import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { useLocation } from '@reach/router';

import './Cursor.scss';
import { AnimationConfig } from '../AnimationConfig';

const config = {
  width: 20,
};

export default function Cursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(false);
  const [mousedown, setMouseDown] = useState(false);

  const handleMouseMove = (e: MouseEvent) => {
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

  useEffect(() => {
    document.body.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseenter', handleMouseEnter);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mousedown', handleMouseDown);
    document.body.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mousedown', handleMouseDown);
      document.body.removeEventListener('mouseup', handleMouseUp);
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
        backgroundColor: linkHovered ? 'rgba(0,0,0, .8)' : 'rgba(0,0,0, .4)',
      }}
      transition={{
        duration: AnimationConfig.VERY_FAST,
        easing: AnimationConfig.EASING,
      }}
    />
  );
}
