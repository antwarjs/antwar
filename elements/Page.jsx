var React = require('react');
var Router = require('react-router');
var Paths = require('antwar-core/PathsMixin');

var SectionItem = require('theme/SectionItem');

module.exports = React.createClass({

  mixins: [ Router.State, Paths ],

  render: function() {
    var item = this.getItem();

    if (typeof item === 'function') {
        return React.createFactory(item)(this.props);
    }

    return React.createFactory(SectionItem)(this.props);
  }
});
