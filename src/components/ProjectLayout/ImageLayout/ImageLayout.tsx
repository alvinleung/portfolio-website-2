import React, { ReactElement, ReactNode } from 'react';

interface Props {
  src: string;
  children: ReactNode;
}

export function ImageLayout({ src, children }: Props): ReactElement {
  return (
    <>
      <img className="main-grid__full-content-col" src={src} />
      {children}
    </>
  );
}

interface ImageCaptionProps {
  type: string;
  children: ReactNode;
}
