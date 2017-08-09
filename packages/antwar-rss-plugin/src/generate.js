const url = require("url");
const e = require("./element");

// TODO: Push to another package or use a pre-existing one over this
module.exports = function({
  baseUrl,
  sections = [],
  updated,
  pages,
  config,
  get
}) {
  return e.feed([
    e.title(config.title),
    e.link(url.resolve(baseUrl, "/atom.xml"), "self"),
    e.link(baseUrl),
    e.updated(updated),
    e.id(baseUrl),
    e.author(config.author),
    e.entries({ baseUrl, sections, pages, get })
  ]);
};
