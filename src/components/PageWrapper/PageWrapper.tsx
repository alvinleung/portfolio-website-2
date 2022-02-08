import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, AnimateSharedLayout } from 'framer-motion';
import Cursor, {
  CursorContextProvider,
  useCursorCustomState,
  CustomStates,
} from '../Cursor/Cursor';
import MainNav from '../MainNav/MainNav';
import { Footer } from '../Footer/Footer';
import { ProjectCardTransition } from '../ProjectCard/ProjectCardTransition';
import TransitionContentWrapper from './TransitionContentWrapper';
import AboutPageTransition from '../AboutPageTransition/AboutPageTransition';

const PageWrapper = ({ children, location }) => {
  // const [prevRoute, setPrevRoute] = useState();
  const prevRoute = useRef(location.pathname);
  const currentRoute = useRef(location.pathname);
  if (currentRoute.current !== location.pathname) {
    prevRoute.current = currentRoute.current;
    currentRoute.current = location.pathname;
  }

  return (
    <>
      <MainNav />
      <CursorContextProvider>
        {/* a context provider for the transitions need to be outside of Animate Presence in order to work */}

        <ProjectCardTransition upcomingRoute={location.pathname}>
          <AnimatePresence initial={true} exitBeforeEnter>
            <TransitionContentWrapper key={location.pathname}>
              <Cursor />
              <AboutPageTransition
                upcomingRoute={currentRoute}
                prevRoute={prevRoute}
              >
                {children}
                <Footer />
              </AboutPageTransition>
            </TransitionContentWrapper>
          </AnimatePresence>
        </ProjectCardTransition>
      </CursorContextProvider>
    </>
  );
};

export default PageWrapper;
