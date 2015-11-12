var React = require('react');
var Paths = require('antwar-core/PathsMixin');

var config = require('config');
var themeHandlers = require('theme').handlers;
var configHandlers = config.handlers || {};
var SectionIndex = (configHandlers.sectionIndex && configHandlers.sectionIndex()) || themeHandlers.sectionIndex();

module.exports = React.createClass({
  mixins: [Paths],
  render: function() {
    // XXX: tidy up and optimize
    let section = this.getSection();
    section.name = this.getSectionName();
    // allow access to all or just part if needed
    section.pages = this.getSectionPages;

    const props = Object.assign({}, this.props, {
      section: section
    });

    return React.createFactory(SectionIndex)(props);
  }
});
