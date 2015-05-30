'use strict';
var React = require('react');
var Router = require('react-router');

var config = require('config');


module.exports = React.createClass({

  displayName: 'NavigationLink',

  mixins: [Router.State],

  render: function() {
    var props = this.props;
    var item = props.item;
    var title = item.title;
    var url = item.url;
    var currentUrl = this.getPathname();

    // TODO: clean up and take trailing/missing slashes in count better
    var relativity = currentUrl.split('/').slice(0, -1).map(() => '../').join('').slice(0, -1);

    return <a href={relativity + url}>{title}</a>;
  },
});
