// Development Flags
const VERBOSE = true;

/**
 *
 *
 * Table of Contents
 *
 * exports:
 *  - ProjectCardTransition
 *    A Context provider component store state of the target
 *    project card state
 *
 *  - useProjectCardTransition
 *    A hook for ProjectCardTransition consmuer component to
 *    interact with the system, basically Wrapper of "useContext"
 *
 * Using the Context API from React, this module handles
 * communication between multiple ProjectCard Components on the page,
 * enabling them to coordinate seemless transition animation.
 *
 *
 */
import React, { useState, useContext, useRef } from 'react';

type projectCardStateContext = {
  transitionState: TransitionState;
  setTransitionState: React.Dispatch<React.SetStateAction<TransitionState>>;
  transformSnapshot: TransformSnapshot;
  setTransformSnapshot: React.Dispatch<React.SetStateAction<TransformSnapshot>>;
};
const ProjectCardContext: React.Context<projectCardStateContext> = React.createContext(
  null,
);

/**
 * TransformSnapshot
 *
 * to pass project card exit configuration to the next page's project card
 */
export interface TransformSnapshot {
  x: number;
  y: number;
  width: number;
  height: number;
  slug: string;
}

/**
 * TransitionState
 *
 * Describe what state the transition is currently in
 */
export enum TransitionState {
  BEGAN,
  DONE,
  INTERRUPTED,
}

/**
 * COMPONENT:
 * ProjectCardContext
 *
 *
 * A Context provider component store state of the target
 * project card state
 */

interface Props {
  children: React.ReactNode;
  upcomingRoute: string;
}
export const ProjectCardTransition: React.FC<Props> = ({
  children,
  upcomingRoute,
}: Props) => {
  // mutable state for transition
  const [transitionState, setTransitionState] = useState<TransitionState>(
    TransitionState.DONE,
  );
  const route = useRef(upcomingRoute);

  const processRouteChange = () => {
    // abort if it's not a page transition of project page
    // ONLY animate the route change between project page and project index page
    if (upcomingRoute.indexOf('projects') === -1 && upcomingRoute !== '/')
      return;
    if (route.current.indexOf('projects') === -1 && route.current !== '/')
      return;

    // setTransitionState if the transition haven't begun
    if (transitionState === TransitionState.DONE) {
      // transition begins
      setTransitionState(TransitionState.BEGAN);
      VERBOSE && console.log(`Transition State: BEGAN`);
      return;
    }
    // route change but the it already started
    if (transitionState === TransitionState.BEGAN) {
      // transition interrupted
      setTransitionState(TransitionState.INTERRUPTED);
      VERBOSE && console.log(`Transition State: Interrupted`);
      return;
    }

    // route change but it's already interrupted
    if (transitionState === TransitionState.INTERRUPTED) {
      // transition interrupted
      setTransitionState(TransitionState.BEGAN);
      VERBOSE && console.log(`Transition State: Began`);
      return;
    }
  };

  // route change detected, process route change
  if (route.current !== upcomingRoute) {
    // if the upcoming url is the project site
    processRouteChange();
    // update the current route to match the latest one
    route.current = upcomingRoute;
  }

  /**
   *
   * The upcomming card will try to match the previous configuration
   * base on the TransformSnaptshot stored in the context.
   *
   */
  const [currentTransformSnapshot, setCurrentTransformSnapshot] = useState<
    TransformSnapshot
  >(null);

  const context: projectCardStateContext = {
    transitionState: transitionState,
    setTransitionState: setTransitionState,
    transformSnapshot: currentTransformSnapshot,
    setTransformSnapshot: setCurrentTransformSnapshot,
  };

  return (
    <ProjectCardContext.Provider value={context}>
      {children}
    </ProjectCardContext.Provider>
  );
};

/**
 * HOOK:
 * useTransitionState
 *
 * A hook for ProjectCardTransition consmuer component to
 * interact with the system, basically Wrapper of "useContext"
 *
 * usage:
 * const [targetTransformState, setTargetTransformState] = useProjectCardTransition();
 */
// targetTransformState, setTargetTransformState
export const useTransitionState = () => {
  const { transitionState, setTransitionState } = useContext(
    ProjectCardContext,
  );
  return [transitionState, setTransitionState] as [
    TransitionState,
    React.Dispatch<React.SetStateAction<TransitionState>>,
  ];
};

/**
 * HOOK:
 * useTransformSnapshot
 *
 * a hook for accessing the snapshot object
 *
 * usage:
 * const [targetTransformState, setTargetTransformState] = useProjectCardTransition();
 */
export const useTransformSnapshot = () => {
  const { transformSnapshot, setTransformSnapshot } = useContext(
    ProjectCardContext,
  );
  return [transformSnapshot, setTransformSnapshot] as [
    TransformSnapshot,
    React.Dispatch<React.SetStateAction<TransformSnapshot>>,
  ];
};

/**
 * Project Card compoennt
 *
 * TransitionElement
 */
interface TransitionWrapperProps {
  onTransitionBegin: Function;
  onMeasurementReady: Function;
  onTransitionInterrupt: Function;
  onTransitionComplete: Function;
  transitionId: string;
  children: React.ReactNode;
}
export const TransitionWrapper = (props: TransitionWrapperProps) => {
  return props.children;
};
