import React from 'react';
import { GoogleAnalytics, Navigation } from 'antwar-helpers';
import { withRouter } from 'react-router';
import GitHubCorner from 'react-github-corner';

import Typekit from './Typekit';

import '../styles/prism.css';
import '../styles/reset.scss';
import '../styles/global.scss';

import classes from './SiteBody.scss';

const SiteBody = ({ children, router }) => {
  const classNames = [classes.body];
  if (router.isActive('/')) classNames.push(classes.home);

  return (
    <div className={classNames.join(' ')}>
      <GitHubCorner
        href="https://github.com/antwarjs/antwar"
        bannerColor="#fff"
        octoColor="#21436F"
        width={80}
        height={80}
        direction="right"
      />
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
};


SiteBody.propTypes = {
  children: React.PropTypes.any
};

export default withRouter(SiteBody);
