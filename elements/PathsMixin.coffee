paths = require('../paths')
React = require('react')
markdown = require 'commonmark'
mdReader = new markdown.Parser()
mdWriter = new markdown.HtmlRenderer()
config = require '../config'

PathsMixin =

	contextTypes:
		getCurrentPathname: React.PropTypes.func.isRequired
		getCurrentParams: React.PropTypes.func.isRequired

	getAllPosts: ->
		paths.allPosts()

	getAllPages: ->
		paths.allPages()

	getPathMeta: (key) ->
		path = @context.getCurrentPathname()
		post = @context.getCurrentParams().post
		if post
			return paths.allPosts()[post][key]
		metas = paths.allPaths()[path]
		if metas then metas[key] else ''

	getPost: ->
		@getPostForPath @context.getCurrentParams().post

	getPostForPath: (path) ->
		postContent = paths.postForPath(path).content
		parsed = mdWriter.render mdReader.parse postContent
		parsed

	getPreviewForPost: (post) ->
		postMeta = paths.allPosts()[post]
		if postMeta.preview
			return postMeta.preview
		# else return the first part of markdown
		md = postMeta.content
		parsed = getLiteral mdReader.parse md
		if parsed.length > 100 then parsed = parsed.substr(0,100) + '…'
		parsed

module.exports = PathsMixin

getLiteral = (part) ->
	return '' unless part._firstChild? or part._literal?
	part._literal or getLiteral part._firstChild
