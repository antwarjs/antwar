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

	getPost: ->
		@getPostForPath @context.getCurrentParams().post

	getPostForPath: (path) ->
		paths.postForPath(path)

	getPageTitle: ->
		post = @getPost()
		if post?.name
			return post.name
		else
			routes = @context.getCurrentRoutes()
			routes[routes.length - 1].name?.replace '/', ''

	getPreviewForPost: (post) ->
		postMeta = paths.allPosts()[post]
		if postMeta.preview
			return postMeta.preview
		# else return the first part of markdown
		md = postMeta.__content
		parsed = getLiteral mdReader.parse md
		if parsed.length > 100 then parsed = parsed.substr(0,100) + '…'
		parsed

module.exports = PathsMixin

getLiteral = (part) ->
	return '' unless part._firstChild? or part._literal?
	part._literal or getLiteral part._firstChild
