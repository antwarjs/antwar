var React = require('react');
var Paths = require('antwar-core/PathsMixin');

var config = require('config');
var themeHandlers = require('theme').handlers || {};
var configHandlers = config.handlers || {};

module.exports = React.createClass({
  mixins: [Paths],
  render: function() {
    var item = this.getItem();
    var layout;

    // XXX: tidy up and optimize
    let section = this.getSection();
    section.name = this.getSectionName();
    // allow access to all or just part if needed
    section.items = this.getSectionItems;

    const props = Object.assign({}, this.props, {
      section: section,
      page: item
    });

    if (typeof item === 'function') {
      return React.createFactory(item)(props);
    }

    // this can happen if you navigate to a page that doesn't exist
    // during development. TODO: give a nice 404 page?
    if(!item) {
      return null;
    }

    if(item.layout && typeof item.layout === 'function') {
      layout = item.layout;
    }
    else if(configHandlers.sectionItem) {
      layout = configHandlers.sectionItem();
    }
    else if(themeHandlers.sectionItem) {
      layout = themeHandlers.sectionItem();
    }
    else {
      // TODO: push to higher level
      console.warn('Configuration or theme is missing `sectionItem` handler');
    }

    return React.createFactory(layout)(props);
  }
});
