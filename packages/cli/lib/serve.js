const http = require('http');

const finalhandler = require('finalhandler');
const serveStatic = require('serve-static');

module.exports = function (config) {
  const directory = config.output;
  const port = config.port;
  const serve = serveStatic(directory, {
    index: ['index.html', 'index.htm']
  });

  config.console.info('Serving ' + directory + ' at localhost:' + port);

  return new Promise(function (resolve) {
    const server = http.createServer(function (req, res) {
      const done = finalhandler(req, res);

      serve(req, res, done);
    });

    process.on('exit', resolve);

    server.listen(port);
  });
};
