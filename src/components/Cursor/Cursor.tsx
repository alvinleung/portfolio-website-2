import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import './Cursor.scss';

const config = {
  width: 20,
};

export default function Cursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    setMousePos({
      x: e.clientX,
      y: e.clientY,
    });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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
        zIndex: 100000,
        backgroundColor: '#00F',
      }}
    />
  );
}
