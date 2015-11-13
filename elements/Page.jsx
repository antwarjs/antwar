var React = require('react');
var Paths = require('antwar-core/PathsMixin');

var config = require('config');
var configHandlers = config.handlers || {};

module.exports = React.createClass({
  mixins: [Paths],
  render: function() {
    var page = this.getPage();
    var layout;

    // XXX: tidy up and optimize
    let section = this.getSection();
    section.name = this.getSectionName();
    // allow access to all or just part if needed
    section.pages = this.getSectionPages;

    const props = Object.assign({}, this.props, {
      section: section,
      page: page
    });

    if (typeof page === 'function') {
      return React.createFactory(page)(props);
    }

    // this can happen if you navigate to a page that doesn't exist
    // during development. TODO: give a nice 404 page?
    if(!page) {
      return null;
    }

    if(page.layout && typeof page.layout === 'function') {
      layout = page.layout;
    }
    else if(configHandlers.sectionPage) {
      layout = configHandlers.sectionPage();
    }
    else {
      // TODO: push to higher level
      console.warn('Configuration is missing `sectionPage` handler');
    }

    return React.createFactory(layout)(props);
  }
});
