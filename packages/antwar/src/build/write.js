const _path = require("path");
const _os = require("os");

const _ = require("lodash");
const async = require("neo-async");

exports.pages = o => finalCb => {
  const data = Object.keys(o.allPages).map(function(page) {
    const p = _path.join(o.output, page);

    return {
      path: p,
      page,
      title: o.allPages[page].title,
    };
  });

  async.map(
    data,
    function(d, cb) {
      return cb(null, {
        path: getPath(d.path),
        page: d.page,
        title: d.title,
      });
    },
    function(err, d) {
      if (err) {
        return finalCb(err);
      }

      return finalCb(
        null,
        _.chunk(d, _os.cpus().length).map(function(partition) {
          return {
            output: o.output,
            pages: partition,
            templates: o.templates,
          };
        })
      );
    }
  );
};

function getPath(path) {
  // If path ends in a file extension, then output as is! This is
  // useful for generating 404.html and such.
  if (_path.extname(path)) {
    return path;
  }

  // Avoid writing index/index.html and write index.html instead
  return path.split("/").slice(-1)[0] === "index"
    ? _path.join(path, "..", "index.html")
    : _path.join(path, "index.html");
}
