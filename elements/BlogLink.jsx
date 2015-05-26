'use strict';
var React = require('react');

var config = require('config');


module.exports = React.createClass({
  displayName: 'BlogLink',
  render: function() {
    var props = this.props;
    var item = props.item;

    // Router.Link yields an absolute link! better do a custom one
    return <a href={item.url}>{props.children}</a>;
  },
});
