require('coffee-script/register');
build = require('./build.coffee');

console.log('Building site…')
build.build();
