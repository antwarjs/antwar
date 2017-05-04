import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';
import BodyContent from '../core/BodyContent';

// TODO: what if a route isn't found?
module.exports = function renderPage(url, cb) {
  const context = {};
  const html = ReactDOMServer.renderToStaticMarkup(
    <StaticRouter location={url} context={context}><BodyContent /></StaticRouter>
  );

  cb(null, html);
};
