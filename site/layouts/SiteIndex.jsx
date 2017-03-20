/* eslint-disable react/jsx-indent */
import React from 'react';
import Hero from '../components/Hero';

import classes from './SiteIndex.scss';

const SiteIndex = () => (
  <div className={classes.siteIndex}>
    <Hero />
    <article className={classes.introduction}>
      <div className={classes.container}>
        <div className={classes.inform}>
          <section>
            <h2>What?</h2>
            <p>
              Antwar is a blog aware static site engine built with React and Webpack. It&apos;s
              fast, extensible and friendly.
            </p>
          </section>
          <section>
            <h2>Why?</h2>
            <p>
              The world needed a site engine that was easy to extend and a pleasure to work with.
            </p>
          </section>
        </div>
      </div>
      <section className={classes.callToAction}>
        <div className={classes.container}>
          <h2>Sounds cool. Can I try it?</h2>
          <p>
            Check out our <a href="/docs/getting-started/">getting started</a> guide. If you have
            questions or want to check out the code, have a look at the
            <a href="https://github.com/antwarjs/antwar">GitHub repo</a>.
          </p>
          <div className={classes.actions}>
            <a className={classes.button} href="/docs/getting-started/">Get Started</a>
            <a className={classes.button} href="https://github.com/antwarjs/antwar">View the Source</a>
          </div>
        </div>
      </section>
    </article>
  </div>
);

export default SiteIndex;
