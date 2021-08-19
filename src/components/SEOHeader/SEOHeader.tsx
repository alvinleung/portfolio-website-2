import React from 'react';
import { Helmet } from 'react-helmet';

const SEOHeader = ({ pageTitle }) => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{pageTitle} - Alvin Leung</title>
      {/* <link rel="canonical" href="http://mysite.com/example" /> */}
    </Helmet>
  );
};

export default SEOHeader;
