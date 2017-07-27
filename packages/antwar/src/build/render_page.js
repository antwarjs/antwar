import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Route, StaticRouter } from 'react-router';
import config from 'config'; // Aliased through webpack
import paths from '../paths';
import BodyContent from '../BodyContent';

// TODO: what if a route isn't found?
module.exports = function renderPage(location, cb) {
  const context = {};

  const allPages = paths.getAllPages(config);
  const page = paths.getPageForPath(location, allPages);

  const html = ReactDOMServer.renderToStaticMarkup(
    <StaticRouter location={location} context={context}>
      <Route component={BodyContent(page, allPages)} />
    </StaticRouter>
  );

  cb(null, { html, page });
};
