'use strict';
var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var config = require('config');

var Paths = require('./PathsMixin');


module.exports = function(Body) {
  return React.createClass({
    displayName: 'Layout',
    mixins: [Router.State, Paths],
    render: function() {
      var pageTitle = this.getPageTitle();
      var siteName = config.name || '';

      pageTitle = pageTitle && pageTitle + ' / ';
      pageTitle += siteName;

      // XXXXXX: inject RSS link via plugin
      return <html>
        <head>
          <title>{pageTitle}</title>
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1, maximum-scale=1, minimal-ui'>
          </meta>
          <link
            rel='alternate'
            type='application/atom+xml'
            title={siteName}
            href='/atom.xml'>
          </link>
          {!__DEV__?
            <link rel='stylesheet' href='/assets/main.css'></link>:
            null}
        </head>
        <body>
          <Body>
            <RouteHandler></RouteHandler>
            {__DEV__ ? <script src='/main-bundle.js'></script> : null}
          </Body>
        </body>
      </html>;
    },
  });
};
