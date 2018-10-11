const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const antwar = require("../");
const moment = require("moment");
const rssPlugin = require("../packages/antwar-rss-plugin");

const environment = process.argv[2];

antwar[environment]({
  environment,
  configurationPaths: {
    antwar: require.resolve("./antwar.config"),
    webpack: require.resolve("./webpack.config"),
  },
})
  .then(({ allPages, output } = {}) => {
    if (environment === "build") {
      const rss = rssPlugin.generate({
        baseUrl: "https://antwar.js.org/",
        sections: ["blog"],
        get: {
          content: page => page.file.body,
          date: page =>
            moment(page.file.attributes.date)
              .utcOffset(0)
              .format(),
          title: page => page.file.attributes.title,
        },
        pages: allPages,
        config: {
          title: "Antwar",
          author: "Juho Vepsäläinen",
        },
      });

      return promisify(fs.writeFile)(path.join(output, "atom.xml"), rss);
    } else {
      console.log("Surf to localhost:3000");
    }
  })
  .catch(err => {
    console.error(err);

    process.exit(1);
  });
