import React, { useState, useRef, useEffect } from 'react';
import useForceUpdate from '../../../hooks/useForceUpdate';
import { motion, AnimatePresence, useIsPresent } from 'framer-motion';
import { useCursorHoverState, CustomStates } from '../../Cursor/Cursor';
import { AnimationConfig } from '@/components/AnimationConfig';

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
  const forceUpdate = useForceUpdate();
  const imgRef = useRef();
  const mousePos = useRef({ x: 0, y: 0 });
  const expandedImagePresent = useRef(false);
  const customStatesEventHandlers = useCursorHoverState(
    isExpanded ? CustomStates.CLOSE : CustomStates.ZOOM_IN,
  );

  // collapse the photo on scroll
  useEffect(() => {
    // don't create the listener if it is not closed
    if (!isExpanded) return;

    const scrollHandler = () => {
      if (isExpanded) {
        setIsExpanded(false);
        checkMouseOutsideImage();
      }
    };
    const mouseMoveHandler = (e: MouseEvent) => {
      mousePos.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    window.addEventListener('scroll', scrollHandler);
    window.addEventListener('mousemove', mouseMoveHandler);
    return () => {
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('mousemove', mouseMoveHandler);
    };
  }, [isExpanded]);

  const checkMouseOutsideImage = () => {
    const imgbb = (imgRef.current as HTMLElement).getBoundingClientRect();

    if (
      mousePos.current.x < imgbb.left ||
      mousePos.current.x > imgbb.right ||
      mousePos.current.y < imgbb.top ||
      mousePos.current.y > imgbb.bottom
    ) {
      // intersection doesn't occur
      // the user is out of the area, can cancel the cursor style manually
      customStatesEventHandlers.onMouseLeave();
    }
  };

  useEffect(() => {
    if (!isExpanded) {
      checkMouseOutsideImage();
    }
  }, [isExpanded]);

  const handleExitAnimationComplete = () => {
    expandedImagePresent.current = false;
    forceUpdate();
    // check if the mouse is still within bounds
    checkMouseOutsideImage();
  };

  const isVideo = getExtension(src) === 'mp4';

  return (
    <figure
      className={className}
      // for hover cursor effects
      style={{ position: 'relative' }}
      // toggle expanded
      onClick={() => {
        setIsExpanded(!isExpanded);
      }}
    >
      <div {...customStatesEventHandlers}>
        {!isVideo && (
          <motion.img
            src={src}
            alt={alt}
            loading="lazy"
            ref={imgRef}
            style={{
              visibility: expandedImagePresent.current ? 'hidden' : 'visible',
            }}
          />
        )}
        {isVideo && (
          <motion.video
            src={src}
            ref={imgRef}
            style={{
              visibility: expandedImagePresent.current ? 'hidden' : 'visible',
              width: '100%',
            }}
            autoPlay
            muted
            loop
            disablePictureInPicture
          />
        )}
        <AnimatePresence onExitComplete={handleExitAnimationComplete}>
          {isExpanded && (
            <ExpandedImage
              imgRef={imgRef}
              src={src}
              alt={alt}
              expandedImagePresent={expandedImagePresent}
            />
          )}
        </AnimatePresence>
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
};

function getExtension(filename) {
  return filename.split('.').pop();
}

const ExpandedImage = ({ imgRef, src, alt, expandedImagePresent }) => {
  expandedImagePresent.current = true;

  const imgBounds = (
    imgRef.current as HTMLImageElement | HTMLVideoElement
  ).getBoundingClientRect();
  const imgBoundsAspectRatio = imgBounds.height / imgBounds.width;

  const expandedWidth = window.innerWidth;
  const expandedHeight = window.innerWidth * imgBoundsAspectRatio;

  const isVideo = getExtension(src) === 'mp4';

  const isPresent = useIsPresent();

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
          pointerEvents: isPresent ? 'auto' : 'none',
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
      {!isVideo && (
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
            top:
              isPresent &&
              -imgBounds.top + (window.innerHeight - expandedHeight) / 2, // move to the middle of the screen
            left: isPresent && -imgBounds.left, // go stright to the left end of the screen
            width: isPresent && expandedWidth,
            height: isPresent && expandedHeight,
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
      )}
      {isVideo && (
        <motion.video
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
            top:
              isPresent &&
              -imgBounds.top + (window.innerHeight - expandedHeight) / 2, // move to the middle of the screen
            left: isPresent && -imgBounds.left, // go stright to the left end of the screen
            width: isPresent && expandedWidth,
            height: isPresent && expandedHeight,
          }}
          exit={{
            top: 0,
            left: 0,
            width: imgBounds.width,
            height: imgBounds.height,
          }}
          transition={{
            duration: AnimationConfig.NORMAL,
            ease: AnimationConfig.EASING,
          }}
          autoPlay
          muted
          loop
          disablePictureInPicture
          src={src}
        />
      )}
    </>
  );
};

export { FullImage, HalfImage };
