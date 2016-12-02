import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';

import classes from './Docs.scss';
import articleClasses from './Article.scss';

const DocsPage = ({ section, page }) => (
  <div className={classes.documentation}>
    <div className={classes.nav}>{_.map(section.pages(), (navPage, i) => (
      navPage.title === page.title ?
        <span key={`navPage-${i}`} className={classes.navLink_active}>
          {navPage.title}
        </span> :
          <Link key={`navPage-${i}`} className={classes.navLink} to={'/' + navPage.url}>
            {navPage.title}
          </Link>
    ))}</div>
    <div className={classes.contentScrollBox}>
      <div className={articleClasses.article}>
        {page.headerImage ?
          <div
            className={articleClasses.headerImage}
            style={{ backgroundImage: `url(${page.headerImage})` }}
          /> : null
        }
        <header className={articleClasses.header}>
          <h1>
            {page.title}
            {page.isDraft ?
              <span className={articleClasses.draftText}>draft</span> :
              null
            }
          </h1>
          {page.author ?
            <div className={articleClasses.author}>{`Authored by ${page.author}`}</div> :
            null
          }
        </header>
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
      </div>
    </div>
  </div>
);

export default DocsPage;
