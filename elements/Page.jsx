var React = require('react');
var Router = require('react-router');
var Paths = require('antwar-core/PathsMixin');

var config = require('config');
var themeHandlers = require('theme').handlers;
var configHandlers = config.handlers || {};
var SectionItem = (configHandlers.sectionItem && configHandlers.sectionItem()) || themeHandlers.sectionItem();

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
