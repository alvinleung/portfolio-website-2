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
import React, { useState, useContext } from 'react';

type projectCardStateContext = [
  TargetTransformState,
  React.Dispatch<React.SetStateAction<TargetTransformState>>,
];
const ProjectCardContext: React.Context<projectCardStateContext> = React.createContext(
  null,
);

export interface TargetTransformState {
  x: number;
  y: number;
  width: number;
  height: number;
  // the identification of ProjectCard, use this to make sure which card to transition to
  slug: string;
}

/**
 * COMPONENT:
 * ProjectCardTransition
 *
 * A Context provider component store state of the target
 * project card state
 */

interface Props {
  children: React.ReactNode;
}
export const ProjectCardTransition: React.FC<Props> = ({ children }: Props) => {
  const targetTransformState = useState<TargetTransformState>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    slug: '',
  });

  return (
    <ProjectCardContext.Provider value={targetTransformState}>
      {children}
    </ProjectCardContext.Provider>
  );
};

/**
 * HOOK:
 * ProjectCardTransition
 *
 * A hook for ProjectCardTransition consmuer component to
 * interact with the system, basically Wrapper of "useContext"
 *
 * usage:
 * const [targetTransformState, setTargetTransformState] = useProjectCardTransition();
 */
// targetTransformState, setTargetTransformState
export const useProjectCardTransition = () => {
  return useContext(ProjectCardContext);
};
