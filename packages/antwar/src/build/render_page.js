import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';
import BodyContent from '../core/BodyContent';

// TODO: what if a route isn't found?
module.exports = function renderPage(location, cb) {
  const context = {};

  const html = ReactDOMServer.renderToStaticMarkup(
    <StaticRouter location={location} context={context}>
      <BodyContent />
    </StaticRouter>
  );

  cb(null, html);
};
