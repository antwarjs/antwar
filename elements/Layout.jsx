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

  getExternalHeadContent: function (paths, pages) {
    var elements =  layoutHooks.headContent({
      config: config,
      paths: paths,
      pages: pages
    });
    return elements;
  },

  render: function() {
    var pageTitle = this.getPageTitle();
    var siteName = config.name || '';

    pageTitle = pageTitle && pageTitle + ' / ';
    pageTitle += siteName;

    return <html>
      <head>
        <title>{pageTitle}</title>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1, minimal-ui'>
        </meta>
        <link rel="icon" type="image/png" href="assets/img/favicon.png"></link>
        {_.map(this.getExternalHeadContent(this.getAllItems()), function (Component, i) {
          return <Component key={'component-' + i} />;
        })}
        {!__DEV__?
          <link rel='stylesheet' href='assets/main.css'></link>:
          null}
      </head>
      <body>
        <RouteHandler></RouteHandler>
        {__DEV__ ? <script src='/main-bundle.js'></script> : null}
      </body>
    </html>;
  }
});
