'use strict';
var React = require('react');

var config = require('config');

module.exports = React.createClass({
  displayName: 'SectionLink',
  render: function() {
    const props = this.props;
    const page = props.page;
    let url = page.url;

    if(!__DEV__ ) {
      // skip category
      url = url.split('/').slice(1).join('/');
    }

    // Router.Link yields an absolute link! better do a custom one
    return <a className="link" href={url}>{props.children}</a>;
  }
});
