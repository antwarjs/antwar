import React from 'react';
import config from 'config';
import paths from '../libs/paths';

export default React.createClass({
  displayName: 'BodyContent',
  propTypes: {
    location: React.PropTypes.object
  },
  render: function() {
    config.style && config.style();

    const allPages = paths.allPages();
    const location = this.props.location;
    const page = paths.pageForPath(location.pathname, allPages);
    const section = this.getSection(page, location.pathname, allPages);

    // skip rendering body during dev, in that case it's up DevIndex
    // to take control of that
    const render = __DEV__ ? this.renderSection : this.renderBody;

    return render(page, {config, section, page, location}, section);
  },
  getSection(page, pathname, allPages) {
    const sectionTitle = page.section ? page.section : _.trim(pathname, '/');
    let section = config.paths[sectionTitle || '/'] || {};
    section.title = section.title || sectionTitle;

    // allow access to all or just part if needed
    section.pages = function(name) {
      return paths.getSectionPages(name || sectionTitle, allPages);
    };

    return section;
  },
  renderBody(page, props, section) {
    const Body = config.layout();

    return <Body {...props}>{this.renderSection(page, props, section)}</Body>
  },
  renderSection(page, props, section) {
    // index doesn't have layouts
    if(!section.layouts) {
      return this.renderPage(page, props);
    }

    // sections don't have page metadata
    if(_.isEmpty(page)) {
      return React.createFactory(section.layouts['index']())(props);
    }

    // ok, got a page now. render it using a page template
    return React.createFactory(section.layouts['page']())(
      props,
      this.renderPage(page, props)
    );
  },
  renderPage(page, props) {
    return _.isPlainObject(page) ? 'div' : React.createFactory(page)(props);
  }
});
