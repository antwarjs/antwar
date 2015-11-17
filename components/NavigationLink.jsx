'use strict';
var React = require('react');

module.exports = React.createClass({
  displayName: 'NavigationLink',
  propTypes: {
    location: React.PropTypes.object
  },
  render: function() {
    var props = this.props;
    var page = props.page;

    if(!page) {
      console.warn('NavigationLink - missing page');

      return;
    }

    var title = page.title;
    var url = page.url;
    var pathName, prefix, wholeUrl;

    if(url.indexOf('http://') || url.indexOf('https://')) {
      wholeUrl = url;
    }
    else {
      pathName = this.props.location.pathname;
      prefix = getPathPrefix(pathName);

      if(url.length > 1) {
        url = url.slice(1);
      }
      else if(prefix) {
        // strip extra slash from prefix for relative root
        prefix = prefix.slice(0, -1);
      }

      wholeUrl = prefix + url;

      if(wholeUrl === '/') {
        wholeUrl = './';
      }
    }

    return <a href={wholeUrl}>{title}</a>;
  }
});

function getPathPrefix(pathName) {
  return pathName.split('/').map(function() {
    return '';
  }).join('../');
}
