'use strict';
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var config = require('config');
var blogRoot = config.blogRoot;


// XXX: too specific as this depends on blogRoot, eliminate
module.exports = React.createClass({
  displayName: 'BlogLink',
  render: function() {
    var props = this.props;
    var post = props.post;

    return <Link to={'/' + blogRoot + '/' + post.url}>{props.children}</Link>;
  },
});
