import React from "react";
import PageWrapper from "./src/components/PageWrapper";

const transitionDelay = 100;

export const wrapPageElement = ({ element, props }) => {
  return <PageWrapper {...props}>{element}</PageWrapper>;
};

export const shouldUpdateScroll = ({
  routerProps: { location },
  getSavedScrollPosition,
  routerProps,
}) => {
  if (location.action === "PUSH") {
    // going to the next page
    // window.setTimeout(() => {
    //   // window.scrollTo(0, 0);
    // }, transitionDelay);
  } else {
    const savedPosition = getSavedScrollPosition(location);
    // window.setTimeout(() => {
    //   // window.scrollTo(...(savedPosition || [0, 0]));
    // }, transitionDelay);
  }

  // bodyScrollLock();
  // return false;

  // ========================================================
  // EXPLAINATION OF RETURNING FALSE
  // returning false  will make the browser NOT scroll to top when
  // user click the portfolio cover
  // AFTER TRANSITION, it will remain the same scroll position

  // by default gatsby will scroll to top when a new link is clicked
  return false;
};

// Prevent the browser history api to do scroll restoration
// it is required or else the gatsby scroll prevention wont be working
history.scrollRestoration = "manual";
