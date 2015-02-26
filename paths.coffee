_ = require 'lodash'
markdown = require 'commonmark'
mdReader = new markdown.Parser()
mdWriter = new markdown.HtmlRenderer()

module.exports =

	allPaths: ->
		_.assign {}, @allPages(), { posts: @allPosts() }

	allPosts: ->
		req = @postReq()
		posts = {}
		_.each req.keys(), (name) ->
			# Name is on format ./YYYY-MM-DD-url_title.md

			file = req name # Require the file
			fileName = name.slice 2 # Remove the "./"

			url = _.kebabCase fileName.slice 11, fileName.length - 3 #Clean the filename to get the url
			date = file.date or fileName.slice 0, 10 # Get the date from the file name if it's not in the frontmatter

			content = mdWriter.render mdReader.parse file.__content

			posts[url] = _.assign {}, file, {
				url
				content
				date
			}
		_.sortBy( posts, 'date')

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

	parseContent: (content) ->
		mdWriter.render mdReader.parse content

