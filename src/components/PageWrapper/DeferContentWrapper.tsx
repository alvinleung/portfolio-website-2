import React from 'react';

interface DeferContentProps {
  children: React.ReactElement;
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
const DeferContentWrapper: React.FC<DeferContentProps> = ({
  children,
}: DeferContentProps) => {
  const filteredChildren = children;

  return filteredChildren;
};

export default DeferContentWrapper;
