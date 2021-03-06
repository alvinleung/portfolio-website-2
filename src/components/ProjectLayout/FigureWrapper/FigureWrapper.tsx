import React from 'react';

export const FigureWrapper = ({ secondary, full, noPadding, children }) => {
  const secondarySelected = secondary === true;
  const fullSelected = full === true;
  const withoutPadding = noPadding === true;

  const gridColumnDispalyMode = (() => {
    if (secondarySelected) return 'main-grid__secondary-col';
    if (fullSelected) return 'main-grid__full-width';
    return 'main-grid__secondary-col';
  })();

  const paddingSetting = (() => {
    if (withoutPadding) return 'display-figure--no-padding';
    return '';
  })();

  return (
    <div
      className={`${gridColumnDispalyMode} display-figure ${paddingSetting}`}
    >
      {children}
    </div>
  );
};

export default FigureWrapper;
