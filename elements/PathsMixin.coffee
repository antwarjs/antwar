paths = require('../paths')
React = require('react')
MdHelper = require './MdHelper'
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
		parsed = MdHelper.getLiteral postMeta.__content
		if parsed.length > 100 then parsed = parsed.substr(0,100) + '…'
		parsed

module.exports = PathsMixin

