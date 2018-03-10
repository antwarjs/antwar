import config from "antwar-config";
import paths from "../paths";
import BodyContent from "../BodyContent";

// TODO: what if a route isn't found?
module.exports = function renderPage(location, cb) {
  const allPages = paths.getAllPages(config);
  const page = paths.getPageForPath(location, allPages);

  config.render.page(
    {
      location,
      content: BodyContent(page, allPages),
    },
    (err, { html, context } = {}) => {
      if (err) {
        return cb(err);
      }

      return cb(null, { html, page, context });
    }
  );
};
