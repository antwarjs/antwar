_ = require 'lodash'

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
			content = file.__content # Content. Still in raw markdown format.
			headerImage = if file.headerImage?.indexOf('http') is 0
				file.headerImage
			else if file.headerImage?
				"/assets/#{file.headerImage}"
			posts[url] = _.assign {}, file,
			{
				url
				content
				date
				headerImage
			}
		posts

	allPages: ->
		req = @pageReq()
		pages = {}
		_.each req.keys(), (name) ->
			# Name is on format ./url_title.ext

			file = req name # Require the file
			fileName = name.slice 2 # Remove the "./"

			url = _.kebabCase fileName.split('.')[0] # url is filename minus extention
			title = _.capitalize url.replace /\-/g , ' ' # Title is the capitalized url
			content = file

			if url is 'index' then url = '/' # Rewrite index file
			pages[url] =
			{
				url
				content
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
