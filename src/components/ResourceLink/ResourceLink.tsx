import React from 'react';
import './ResourceLink.scss';

export const ResourceLink = ({ children, url }) => {
  return (
    <div className="main-grid__primary-col">
      <a href={url} target="blank" className="resource-link">
        {children}
        <img src="/img/icons/open-in-new.svg" alt="open in new window" />
      </a>
    </div>
  );
};
