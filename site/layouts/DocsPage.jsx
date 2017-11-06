import React from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import GitHubCorner from "react-github-corner";

import classes from "./DocsPage.scss";
import articleClasses from "./Article.scss";

const DocsPage = ({
  section,
  page: { file: { attributes: { headerImage, title }, body } },
}) => (
  <div className={classes.documentation}>
    <div className={classes.nav}>
      {_.map(
        section.pages(),
        (navPage, i) =>
          navPage.file.attributes.title === title ? (
            <span key={`navPage-${i}`} className={classes.navLink_active}>
              {navPage.file.attributes.title}
            </span>
          ) : (
            <Link
              key={`navPage-${i}`}
              className={classes.navLink}
              to={navPage.url}
            >
              {navPage.file.attributes.title}
            </Link>
          )
      )}
    </div>
    <div className={articleClasses.contentScrollBox}>
      <GitHubCorner
        href="https://github.com/antwarjs/antwar"
        direction="right"
      />
      <article className={articleClasses.article}>
        {headerImage && (
          <div
            className={articleClasses.headerImage}
            style={{ backgroundImage: `url(${headerImage})` }}
          />
        )}
        <header className={articleClasses.header}>
          <h1>{title}</h1>
        </header>
        <div dangerouslySetInnerHTML={{ __html: body }} />
      </article>
    </div>
  </div>
);

export default DocsPage;
