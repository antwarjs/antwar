var React = require('react');
var Router = require('react-router');
var Paths = require('antwar-core/PathsMixin');

module.exports = React.createClass({

  mixins: [ Router.State, Paths ],

  render: function() {
    return React.createFactory(this.getItem())(this.props);
  }
});
