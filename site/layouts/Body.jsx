import React from 'react';
import { GoogleAnalytics, Navigation } from 'antwar-helpers';

import '../styles/custom.scss';
import '../styles/prism.css';

const SiteBody = ({ children }) => (
  <div>
    <Navigation
      pages={[
        { title: 'Home', url: '/' },
        { title: 'Documentation', url: '/docs' },
        { title: 'Blog', url: '/blog' }
      ]}
    />

    {children}

    <GoogleAnalytics analyticsId="UA-60511795-1" />
  </div>
);
SiteBody.propTypes = {
  children: React.PropTypes.any
};

export default SiteBody;
