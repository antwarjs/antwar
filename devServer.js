require('coffee-script/register');
server = require('./devServer.coffee');
build = require('./build.coffee');

console.log('Starting dev server…')
build.buildDevIndex();
server.dev('build');
