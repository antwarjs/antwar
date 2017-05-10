import React from 'react';
import { Moment, PrevNext } from 'antwar-helpers';
import GitHubCorner from 'react-github-corner';

import classes from './BlogPage.scss';
import articleClasses from './Article.scss';

const BlogPage = ({
  page: {
    file: {
      attributes: {
        author, date, headerExtra, headerImage, title
      },
      body
    },
    previous,
    next
  }
}) => (
  <div className={[classes.blogPost, articleClasses.contentScrollBox].join(' ')}>
    <GitHubCorner href="https://github.com/antwarjs/antwar" direction="right" />
    <div className={articleClasses.article}>
      {headerImage ?
        <div
          className={articleClasses.headerImage}
          style={{
            backgroundImage: `url(${headerImage})`
          }}
        /> :
        null
      }
      <header className={articleClasses.header}>
        <h1>
          {title}
        </h1>
        {author ?
          <div className={articleClasses.author}>{`Authored by ${author}`}</div> :
          null
        }
        {date ?
          <Moment className={articleClasses.date} datetime={date} /> :
          null
        }
      </header>
      {headerExtra ?
        <div
          className="header-extra"
          dangerouslySetInnerHTML={{ __html: headerExtra }}
        /> :
        null
      }
      <div dangerouslySetInnerHTML={{ __html: body }} />
      <footer className={classes.footer}>
        <PrevNext
          previous={previous}
          next={next}
          previousText="Previous post"
          nextText="Next post"
          getTitle={({ file }) => file.attributes.title}
        />
      </footer>
    </div>
  </div>
);

export default BlogPage;
