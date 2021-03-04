import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, AnimateSharedLayout } from 'framer-motion';
import { useCursorHoverState, CustomStates } from '../../Cursor/Cursor';
import { AnimationConfig } from '@/components/AnimationConfig';
import { Animation } from 'framer-motion/types/motion/features/animation';

const FullImage = (props) => {
  const withPadding = 'main-grid__full-content display-figure';
  const noPadding =
    'main-grid__full-content display-figure display-figure--no-padding';

  return (
    <ExpandableImage
      className={props.noPadding ? noPadding : withPadding}
      src={props.src}
      alt={props.alt}
      caption={props.caption}
    />
  );
};

const HalfImage = (props) => {
  const primaryClass = 'main-grid__primary-col display-figure';
  const secondaryClass = 'main-grid__secondary-col display-figure';

  const withPadding = '';
  const noPadding = ' display-figure--no-padding';

  return (
    <ExpandableImage
      className={
        (props.secondary ? secondaryClass : primaryClass) +
        (props.noPadding ? noPadding : withPadding)
      }
      src={props.src}
      alt={props.alt}
      caption={props.caption}
    />
  );
};

const ExpandableImage = ({ className, src, alt, caption }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const imgRef = useRef();
  const expandedImagePresent = useRef(false);
  const customStatesEventHandlers = useCursorHoverState(
    isExpanded ? CustomStates.ZOOM_OUT : CustomStates.ZOOM_IN,
  );

  // collapse the photo on scroll
  useEffect(() => {
    // don't create the listener if it is not closed
    if (!isExpanded) return;

    const scrollHandler = () => {
      if (isExpanded) setIsExpanded(false);
    };
    window.addEventListener('scroll', scrollHandler);
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, [isExpanded]);

  const handleExitAnimationComplete = () => {
    expandedImagePresent.current = false;
  };

  return (
    <figure
      className={className}
      // for hover cursor effects
      {...customStatesEventHandlers}
      style={{ position: 'relative' }}
      // toggle expanded
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        ref={imgRef}
        style={{
          visibility: expandedImagePresent.current ? 'hidden' : 'visible',
        }}
      />
      <AnimatePresence onExitComplete={handleExitAnimationComplete}>
        {isExpanded && ExpandedImage(imgRef, src, alt, expandedImagePresent)}
      </AnimatePresence>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
};

const ExpandedImage = (imgRef, src, alt, expandedImagePresent) => {
  expandedImagePresent.current = true;

  const imgBounds = (imgRef.current as HTMLImageElement).getBoundingClientRect();
  const imgBoundsAspectRatio = imgBounds.height / imgBounds.width;

  const expandedWidth = window.innerWidth;
  const expandedHeight = window.innerWidth * imgBoundsAspectRatio;

  return (
    <>
      {/* dimmer */}
      <motion.div
        style={{
          backgroundColor: 'rgba(0,0,0,.4)',
          position: 'fixed',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 10000,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          ease: AnimationConfig.EASING,
          duration: AnimationConfig.NORMAL,
        }}
      ></motion.div>
      {/* img */}
      <motion.img
        style={{
          position: 'absolute',
          zIndex: 10000,
          maxWidth: '100vw',
        }}
        initial={{
          top: 0,
          left: 0,
          width: imgBounds.width,
          height: imgBounds.height,
        }}
        animate={{
          top: -imgBounds.top + (window.innerHeight - expandedHeight) / 2, // move to the middle of the screen
          left: -imgBounds.left, // go stright to the left end of the screen
          width: expandedWidth,
          height: expandedHeight,
        }}
        exit={{
          top: 0,
          left: 0,
          width: imgBounds.width,
          height: imgBounds.height,
        }}
        src={src}
        alt={alt}
        loading="lazy"
        transition={{
          duration: AnimationConfig.NORMAL,
          ease: AnimationConfig.EASING,
        }}
      />
    </>
  );
};

export { FullImage, HalfImage };
