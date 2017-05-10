import React from 'react';
import { GoogleAnalytics } from 'antwar-helpers';
import { Link, NavLink } from 'react-router-dom';
import GitHubCorner from 'react-github-corner';
import PropTypes from 'prop-types';

import Typekit from '../components/Typekit';

import '../styles/prism.css';
import '../styles/reset.scss';
import '../styles/global.scss';

import classes from './SiteBody.scss';

const SiteBody = ({ children, location }) => {
  const isHomePage = location.pathname === '/';
  const classNames = [classes.body];

  if (isHomePage) {
    classNames.push(classes.home);
  }

  return (
    <div className={classNames.join(' ')}>
      { isHomePage ?
        <GitHubCorner href="https://github.com/antwarjs/antwar" direction="left" /> :
        null
      }
      <div className={classes.navWrapper}>
        <nav className={classes.nav}>
          <Link className={classes.navTitle} to="/">Antwar</Link>
          <NavLink exact activeClassName={classes.activeLink} to="/">Home</NavLink>
          <NavLink activeClassName={classes.activeLink} to="/docs/">Documentation</NavLink>
          <NavLink activeClassName={classes.activeLink} to="/blog/">Blog</NavLink>
        </nav>
      </div>

      {children}

      <Typekit />
      <GoogleAnalytics analyticsId="UA-60511795-1" />
    </div>
  );
};
SiteBody.propTypes = {
  children: PropTypes.any
};

export default SiteBody;
