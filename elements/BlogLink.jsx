'use strict';
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var config = require('config');


module.exports = React.createClass({
  displayName: 'BlogLink',
  render: function() {
    var props = this.props;
    var post = props.post;

    return <Link to={'/' + post.path + '/' + post.url}>{props.children}</Link>;
  },
});
