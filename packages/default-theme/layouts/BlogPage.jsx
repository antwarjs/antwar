import React from 'react';
import {Moment, PrevNext} from 'antwar-helpers/components';

export default React.createClass({
  displayName: 'BlogPage',
  render() {
    const page = this.props.page;

    return (
      <div>
        <div className="post">
          {page.headerImage ?
            <div className="header-image" style={{
              backgroundImage: `url(${page.headerImage})`
            }} /> :
            null
          }
          <h1 className="post__heading">{page.title}</h1>
          <div className="post__content">
            {page.isDraft ?
              <span className="draft-text">Draft</span> :
              null
            }
            <div dangerouslySetInnerHTML={{__html: page.content}} />
          </div>
          {page.headerExtra ?
            <div className="header-extra"
              dangerouslySetInnerHTML={{__html: page.headerExtra}} /> :
            null
          }
          {page.date ?
            <Moment className="post__moment" datetime={page.date} /> :
            null
          }
          {page.author ?
            <div className="post__author">{`Authored by ${page.author}`}</div> :
            null
          }

          <PrevNext page={page} previousText="Previous post" nextText="Next post" />
        </div>
      </div>
    );
  }
});
