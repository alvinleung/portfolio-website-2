import useForceUpdate from '@/hooks/useForceUpdate';
import { AnimatePresence } from 'framer-motion';
import React, { useRef } from 'react';
import { useState } from 'react';

interface DeferChangeWrapperProps {
  children: React.ReactElement;
  currentRoute: string; // for detecting path change
}

/**
 *
 * The purpose of this component is to cache the old children in order have
 * both old and new page content be present at the same time(for a short while).
 *
 * This enable us to measure new page ProjectCard component before initiating
 * exit animation in framer motion.
 *
 */
const DeferChangeWrapper: React.FC<DeferChangeWrapperProps> = ({
  children,
  currentRoute,
}: DeferChangeWrapperProps) => {
  const filteredChildren = children;

  const forceUpdate = useForceUpdate();
  // toggling whether its time to update/trigging the old child exit animation
  const canUpdate = useRef(true);

  // to measure weather the route has changed
  const routeName = useRef(currentRoute);
  const presenceRouteName = useRef(currentRoute);

  // capture the initial child state
  const renderingChildren = useRef(children);

  // the route has changed, the page is transitioning
  if (routeName.current !== currentRoute || !canUpdate) {
    // update the current route
    routeName.current = currentRoute;
    canUpdate.current = false;

    console.log(`Defer Route State: both route exist`);

    // TODO: instead of timing the refersh, make it refersh after measuring
    // refresh the value after 1 sec
    // ( assuming you need 1 sec to measure the target container)
    // The idea is to hold the document long enough so that the containe
    setTimeout(() => {
      console.log(`Defer Route State: transition finished, new route only`);
      canUpdate.current = true;
      presenceRouteName.current = routeName.current;
      forceUpdate();
    }, 100);

    // returning an "inbetween" state, the two pages - upcoming and current exist together
    // for a moment, let the new page measure position
    return (
      <AnimatePresence initial={false}>
        {/* use key changes to tigger the route change animation, conversely we can use
       same key to defer the exit animation, telling framer motion that we are
       still at the same page */}
        <React.Fragment key={presenceRouteName.current}>
          {renderingChildren.current}
          {children}
        </React.Fragment>
      </AnimatePresence>
    );
  }

  // update the children reference if the mutation does not come from route change
  renderingChildren.current = children;

  return (
    <AnimatePresence initial={false}>
      {/* use key changes to tigger the route change animation, conversely we can use
       same key to defer the exit animation, telling framer motion that we are
       still at the same page */}
      <React.Fragment key={presenceRouteName.current}>
        {renderingChildren.current}
      </React.Fragment>
    </AnimatePresence>
  );
};

export default DeferChangeWrapper;
