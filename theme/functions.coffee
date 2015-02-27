_ = require 'lodash'

module.exports =
	url: (file, fileName) ->
		_.kebabCase fileName.slice 11, fileName.length - 3 #Clean the filename to get the url
