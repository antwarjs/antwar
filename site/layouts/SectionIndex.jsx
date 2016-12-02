import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import { Moment } from 'antwar-helpers';

import classes from './SectionIndex.scss';

const SectionIndex = ({ section }) => (
  <div className={classes.sectionIndex}>
    <h1>{section.title || 'Blog posts'}</h1>

    <ul className={classes.list}>{_.map(section.pages(), (page, i) => (
      <li key={`post-list-item-${i}`} className={classes.item}>
        <Link to={'/' + page.url}>
          <h3 className={classes.header}>
            {page.title}
            {page.isDraft ?
              <span className={classes.draftText}>Draft</span> :
              null
            }
          </h3>

          {page.date ?
            <Moment className={classes.date} datetime={page.date} /> :
            null
          }
          <p className={classes.preview}>{page.preview}</p>
        </Link>
      </li>
    ))}</ul>
  </div>
);

export default SectionIndex;
