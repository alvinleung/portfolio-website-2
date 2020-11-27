import React from "react";
import PageWrapper from "./src/components/PageWrapper";

const transitionDelay = 500;

export const wrapPageElement = ({ element, props }) => {
  return <PageWrapper {...props}>{element}</PageWrapper>;
};

export const shouldUpdateScroll = ({
  routerProps: { location },
  getSavedScrollPosition,
}) => {
  if (location.action === "PUSH") {
    window.setTimeout(() => {
      // window.scrollTo(0, 0);
      // bodyScrollUnlock();
    }, transitionDelay);
  } else {
    const savedPosition = getSavedScrollPosition(location);
    window.setTimeout(() => {
      // window.scrollTo(...(savedPosition || [0, 0]));
      // bodyScrollUnlock();
    }, transitionDelay);
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

const bodyScrollLock = () => {
  document.body.style.position = "fixed";
  document.body.style.overflowY = "scroll";
  document.body.style.width = "100%";
};

const bodyScrollUnlock = () => {
  document.body.style.position = "static";
  document.body.style.overflowY = "scroll";
  document.body.style.width = "100%";
};
