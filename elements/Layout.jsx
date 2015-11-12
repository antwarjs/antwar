'use strict';
var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var config = require('config');
var layoutHooks = require('../layoutHooks');

var Paths = require('./PathsMixin');
var _ = require('lodash');

module.exports = React.createClass({

  displayName: 'Layout',

  mixins: [Router.State, Paths],

  // XXXXX: this probably should pass section pages?
  getExternalHeadContent: function (paths, pages) {
    var elements =  layoutHooks.headContent({
      config: config,
      paths: paths,
      pages: pages
    });
    return elements;
  },

  render: function() {
    var language = config.language || 'en';
    var titleGetter = config.pageTitle || getPageTitle;
    var pageTitle = titleGetter(config, this.getPageTitle());

    var pathName = this.getPathname();
    var prefix = this.getPathPrefix(pathName);
    var page = this.getPage();
    var description =  page.description || config.description;
    var keywords = page.keywords || config.keywords;

    return (
      <html lang={language}>
        <head>
          <title>{pageTitle}</title>
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1, maximum-scale=1, minimal-ui' />
          <meta
            name='description'
            content={description} />
          <meta
            name='keywords'
            content={keywords} />
          <link rel='icon' type='image/png' href={prefix + 'assets/img/favicon.png'}></link>
          {_.map(this.getExternalHeadContent(this.getAllPages()), function (Component, i) {
            return <Component key={'component-' + i} />;
          })}
          {!__DEV__?
            <link rel='stylesheet' href={prefix + 'assets/main.css'}></link>:
            null}
        </head>
        <body>
          <RouteHandler></RouteHandler>
          {__DEV__ ? <script src='/main-bundle.js'></script> : null}
        </body>
      </html>
    );
  }
});

function getPageTitle(config, pageTitle) {
  var siteName = config.name || '';
  var ret = pageTitle && pageTitle + ' / ';

  ret += siteName;

  return ret;
}
