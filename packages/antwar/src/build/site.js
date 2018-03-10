const config = require("antwar-config");

module.exports = {
  renderPage: require("./render-page"),
  allPages: require("../paths").getAllPages(config),
};
