import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import { Moment } from 'antwar-helpers';

const SectionIndex = ({ section }) => (
  <div className="grid">
    <h1>{section.title || 'Blog posts'}</h1>

    <ul className="post-list">{_.map(section.pages(), (page, i) => (
      <li key={`post-list-item-${i}`}>
        <h3 className="post-list__heading">
          <Link to={'/' + page.url}>{page.title}</Link>

          {page.isDraft ?
            <span className="draft-text">Draft</span> :
            null
          }
        </h3>

        {page.date ?
          <Moment className="post__moment" datetime={page.date} /> :
          null
        }

        <p className="post-list__preview">{page.preview}</p>
      </li>
    ))}</ul>
  </div>
);

export default SectionIndex;
