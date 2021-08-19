import React, { useEffect, useRef } from 'react';
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

const PageWrapper = ({ children, location }) => {
  return (
    <>
      <MainNav />
      <CursorContextProvider>
        {/* a context provider for the transitions need to be outside of Animate Presence in order to work */}

        <ProjectCardTransition upcomingRoute={location.pathname}>
          <AnimatePresence initial={true} exitBeforeEnter>
            <TransitionContentWrapper key={location.pathname}>
              <Cursor />
              {children}
              <Footer />
            </TransitionContentWrapper>
          </AnimatePresence>
        </ProjectCardTransition>
      </CursorContextProvider>
    </>
  );
};

export default PageWrapper;
