const _ = require("lodash");
const moment = require("moment");
const generateAdjacent = require("./utils/generate-adjacent");

module.exports = {
  template: {
    rss: {
      title: "Antwar",
      href: "/atom.xml",
    },
  },
  output: "build",
  layout: () => require("./layouts/SiteBody").default,
  paths: {
    "/": {
      content: () => require.context("./pages", true, /^\.\/.*\.md$/),
      layout: () => require("./layouts/Page").default,
      index: () => require("./layouts/SiteIndex").default,
      paths: {
        blog: {
          layout: () => require("./layouts/BlogPage").default,
          index: () => {
            const index = require("./layouts/SectionIndex").default;

            index.title = "Blog";

            return index;
          },
          transform: pages =>
            generateAdjacent(_.sortBy(pages, "date")).reverse(),
          url: ({ fileName }) => `/${cleanBlogPath(fileName)}/`,
        },
        docs: {
          layout: () => require("./layouts/DocsPage").default,
          index: () => {
            const index = require("./layouts/SectionIndex").default;

            index.title = "Documentation";

            return index;
          },
          transform: pages =>
            _.sortBy(pages, page => page.file.attributes.sort),
        },
      },
    },
  },
};

function cleanBlogPath(resourcePath) {
  const parts = resourcePath.split("/");
  const beginning = parts.slice(0, -1);
  const end = _.trimStart(parts.slice(-1)[0], "0123456789-_");

  return beginning
    .concat(end)
    .join("/")
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/_/g, "-");
}
