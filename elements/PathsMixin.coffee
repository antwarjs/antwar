paths = require('../paths')
React = require('react')
markdown = require 'commonmark'
mdReader = new markdown.Parser()
mdWriter = new markdown.HtmlRenderer()

PathsMixin =

	contextTypes:
		getCurrentPathname: React.PropTypes.func.isRequired
		getCurrentParams: React.PropTypes.func.isRequired

	getAllPosts: ->
		paths.allPosts()

	getAllPages: ->
		paths.allPosts()

	getPathMeta: (key) ->
		path = @context.getCurrentPathname()
		post = @context.getCurrentParams().post
		if post
			return paths.allPosts()[post][key]
		metas = paths.allPaths()[path]
		if metas then metas[key] else ''

	getPost: ->
		postContent = paths.postForPath(@context.getCurrentParams().post).content
		parsed = mdWriter.render mdReader.parse postContent
		parsed

	getPostForPath: (path) ->
		paths.postForPath path

	getPreviewForPost: (post) ->
		postMeta = paths.allPosts()[post]
		if postMeta.preview
			return postMeta.preview
		# else return the first line from the markdown
		md = paths.postForPath(post).content
		md.substr 0, md.indexOf('\n')

module.exports = PathsMixin
