import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Route, StaticRouter } from 'react-router';
import BodyContent from '../core/BodyContent';

// TODO: what if a route isn't found?
module.exports = function renderPage(location, cb) {
  const context = {};

  const html = ReactDOMServer.renderToStaticMarkup(
    <StaticRouter location={location} context={context}>
      <Route component={BodyContent} />
    </StaticRouter>
  );

  cb(null, html);
};
