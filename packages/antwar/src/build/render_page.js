import React from "react";
import ReactDOMServer from "react-dom/server";
import { Route, StaticRouter } from "react-router";
import config from "config"; // Aliased through webpack
import paths from "../paths";
import BodyContent from "../BodyContent";

// TODO: what if a route isn't found?
module.exports = function renderPage(location, cb) {
  const allPages = paths.getAllPages(config);
  const page = paths.getPageForPath(location, allPages);

  (config.renderPage || renderDefault)(
    {
      location,
      content: BodyContent(page, allPages),
    },
    (err, { html, context }) => {
      if (err) {
        return cb(err);
      }

      return cb(null, { html, page, context });
    }
  );
};

function renderDefault({ location, content }, cb) {
  cb(null, {
    html: ReactDOMServer.renderToStaticMarkup(
      <StaticRouter location={location} context={{}}>
        <Route component={content} />
      </StaticRouter>
    ),
  });
}
