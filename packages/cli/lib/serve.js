'use strict';

var http = require('http');

var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');


module.exports = function(config) {
    var directory = config.output;
    var port = config.port;
    var serve = serveStatic(directory, {'index': ['index.html', 'index.htm']});

    config.console.info('Serving ' + directory + ' at localhost:' + port);

    return new Promise(function(resolve) {
        var server = http.createServer(function(req, res) {
            var done = finalhandler(req, res);

            serve(req, res, done);
        });

        process.on('exit', function() {
            resolve();
        });

        server.listen(port);
    });
};
