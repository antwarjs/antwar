const config = require("config"); // Alias by webpack

module.exports = {
  renderPage: require("./render-page"),
  allPages: require("../paths").getAllPages(config),
};
