import useGoogleAnalyticsEvent from '@/hooks/useGoogleAnalyticsEvent';
import React from 'react';
import './ResourceLink.scss';

export const ResourceLink = ({ children, url, resourceName }) => {
  const logResourceEvent = useGoogleAnalyticsEvent('resource-link-click');
  const handleResourceLinkClick = () => {
    logResourceEvent({
      resourceName: resourceName ? resourceName : children,
    });
  };

  return (
    <div className="main-grid__primary-col">
      <a
        href={url}
        target="blank"
        className="resource-link"
        onClick={handleResourceLinkClick}
      >
        {children}
        <img src="/img/icons/open-in-new.svg" alt="open in new window" />
      </a>
    </div>
  );
};
