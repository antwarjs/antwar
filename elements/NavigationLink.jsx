'use strict';
var React = require('react');
var Router = require('react-router');

var config = require('config');

var Paths = require('./PathsMixin');

module.exports = React.createClass({

  displayName: 'NavigationLink',

  mixins: [Router.State, Paths],

  render: function() {
    var props = this.props;
    var item = props.item;
    var title = item.title;
    var url = item.url;

    var pathName = this.getPathname();
    var prefix = this.getPathPrefix(pathName);

    if(url.length > 1) {
      url = url.slice(1);
    }
    else if(prefix) {
      // strip extra slash from prefix for relative root
      prefix = prefix.slice(0, -1);
    }

    var wholeUrl = prefix + url;

    if(wholeUrl === '/') {
      wholeUrl = './';
    }

    return <a href={wholeUrl}>{title}</a>;
  },
});
