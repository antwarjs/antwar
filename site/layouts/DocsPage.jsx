import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';

import classes from './Docs.scss';

const DocsPage = ({ section, page }) => (
  <div className={classes.post}>
    <div className={classes.nav}>{_.map(section.pages(), (navPage, i) => (
      navPage.title === page.title ?
        <span key={`navPage-${i}`} className={classes.navLink_active}>
          {navPage.title}
        </span> :
          <Link key={`navPage-${i}`} className={classes.navLink} to={'/' + navPage.url}>
            {navPage.title}
          </Link>
    ))}</div>

    {page.headerImage ?
      <div
        className={classes.headerImage}
        style={{ backgroundImage: `url(${page.headerImage})` }}
      /> : null
    }

    <div className={classes.postContentScrollBox}>
      <div className={classes.postContent}>
        <header className={classes.postHeading}>
          <h1>{page.title}</h1>
          {page.isDraft ?
            <span className={classes.draftText}>draft</span> :
            null
          }
          {page.author ?
            <div className={classes.postAuthor}>{`Authored by ${page.author}`}</div> :
            null
          }
        </header>
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
      </div>
    </div>
  </div>
);

export default DocsPage;
