import React from 'react';
import { GoogleAnalytics, Navigation } from 'antwar-helpers';
import Typekit from './Typekit';

import '../styles/prism.css';
import '../styles/reset.scss';
import '../styles/global.scss';

import './Body.scss';

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

    <Typekit />
    <GoogleAnalytics analyticsId="UA-60511795-1" />
  </div>
);


SiteBody.propTypes = {
  children: React.PropTypes.any
};

export default SiteBody;
