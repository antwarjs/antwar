var React = require('react');
var Router = require('react-router');
var Paths = require('antwar-core/PathsMixin');

module.exports = React.createClass({
  mixins: [ Router.State, Paths ],
  render: function() {
    // XXX: tidy up and optimize
    let section = this.getSection();
    section.name = this.getSectionName();
    // allow access to all or just part if needed
    section.items = this.getSectionItems;

    const props = Object.assign({}, this.props, {
      section: section,
      page: this.getItem()
    });

    return React.createFactory(this.getItem())(props);
  }
});
