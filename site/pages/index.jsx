import React from 'react';
import _ from 'lodash';
import {Markdown, Teaser} from 'antwar-helpers/components';

module.exports = React.createClass({
  displayName: 'Index',
  render() {
    const props = this.props;

    return (
      <div className="post post--front">
        <div className="header-image header-image--front" style={{
          backgroundImage: `url(/assets/img/front.jpg)`
        }} />

        <div className="post__heading">
          <span className="logo logo--front" dangerouslySetInnerHTML={{__html: require('assets/logo.svg')}} />

          <h1 className="front-header">Antwar</h1>
          <h3>A nice static site engine</h3>

          <div className="front__buttons">
            <a href="docs/getting-started/" className="btn btn--inverted">Get Started</a>
            <a href="docs/" className="btn btn--inverted">Documentation</a>
            <a href="https://github.com/antwarjs/antwar" className="btn btn--inverted">View on GitHub</a>
          </div>

          <Teaser sectionPages={props.section.pages} section="blog" amount={1} />
        </div>

        <div className="post__content">
          <Markdown file={require('./index.md')} />
        </div>
      </div>
    );
  }
});
