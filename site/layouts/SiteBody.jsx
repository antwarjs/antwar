import React from 'react';
import { GoogleAnalytics } from 'antwar-helpers';
import { withRouter, Link } from 'react-router';
import GitHubCorner from 'react-github-corner';

import Typekit from '../components/Typekit';

import '../styles/prism.css';
import '../styles/reset.scss';
import '../styles/global.scss';

import classes from './SiteBody.scss';

const SiteBody = ({ children, router }) => {
  const isHomePage = router.isActive('/');
  const classNames = [classes.body];
  if (isHomePage) classNames.push(classes.home);

  return (
    <div className={classNames.join(' ')}>
      { isHomePage ?
        <GitHubCorner href="https://github.com/antwarjs/antwar" direction="left" /> :
        null
      }
      <div className={classes.navWrapper}>
        <nav className={classes.nav}>
          <Link className={classes.navTitle} to="/">Antwar</Link>
          <Link activeClassName={classes.activeLink} to="/">Home</Link>
          <Link activeClassName={classes.activeLink} to="/docs">Documentation</Link>
          <Link activeClassName={classes.activeLink} to="/blog">Blog</Link>
        </nav>
      </div>

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
