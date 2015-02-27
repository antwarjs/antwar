_ = require 'lodash'
markdown = require 'commonmark'
mdReader = new markdown.Parser()
mdWriter = new markdown.HtmlRenderer()
themeFunctions = require './theme/functions'

module.exports =

	allPaths: ->
		_.assign {}, @allPages(), { posts: @allPosts() }

	allPosts: ->
		returnObj = {}
		posts = _.map @postReq().keys(), (name) =>
			[
				name
				@postReq() name
			]
		drafts = if process.env.NODE_ENV isnt 'production'
			_.map @draftReq().keys(), (name) =>
				[
					name
					_. assign draft: true, @draftReq() name
				]
		else []

		# Build some nice objects from the files
		_.each posts.concat(drafts), (fileArr) ->
			# Name is on format ./YYYY-MM-DD-url_title.md
			fileName = fileArr[0].slice 2 # Remove the "./"
			file = fileArr[1]
			# console.log file, fileName, returnObj

			url = themeFunctions?.url?(file, fileName) or fileName.slice 0, fileName.length - 3 #Clean the filename to get the url
			date = file.date or fileName.slice 0, 10 # Get the date from the file name if it's not in the frontmatter

			content = mdWriter.render mdReader.parse file.__content
			returnObj[url] = _.assign {}, file, {
				url
				content
				date
			}
		# console.log returnObj
		returnObj

	allPages: ->
		req = @pageReq()
		pages = {}
		_.each req.keys(), (name) ->
			# Name is on format ./url_title.ext

			file = req name # Require the file
			fileName = name.slice 2 # Remove the "./"

			url = _.kebabCase fileName.split('.')[0] # url is filename minus extention
			title = _.capitalize url.replace /\-/g , ' ' # Title is the capitalized url

			if url is 'index' then url = '/' # Rewrite index file
			pages[url] =
			{
				url
				fileName
				title
			}
		pages

	postForPath: (path) ->
		@allPosts()[path]

	pageForPath: (path) ->
		@allPages()[path]

	pageReq: ->
		require.context './pages', false

	postReq: ->
		require.context './posts', false, /^\.\/.*\.md$/

	draftReq: ->
		require.context './drafts', false, /^\.\/.*\.md$/

	parseContent: (content) ->
		mdWriter.render mdReader.parse content

