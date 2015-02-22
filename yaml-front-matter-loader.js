yaml = require('yaml-front-matter');

module.exports = function (source) {
	this.cacheable && this.cacheable();
	return JSON.stringify(yaml.parse(source));
}

