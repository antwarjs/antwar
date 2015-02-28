_ = require 'lodash'
markdown = require 'commonmark'
mdReader = new markdown.Parser()
mdWriter = new markdown.HtmlRenderer()

getLiteral = (part) ->
	return '' unless part._firstChild? or part._literal?
	part._literal or getLiteral part._firstChild

module.exports =

	parse: (content) ->
		if _.isObject content then content = content.__content
		mdWriter.render mdReader.parse content

	getLiteral: (content) -> getLiteral content
