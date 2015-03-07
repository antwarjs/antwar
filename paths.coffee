_ = require 'lodash'
MdHelper = require './elements/MdHelper'
themeFunctions = require 'theme/functions'

module.exports =

  allPosts: ->
    returnObj = {}
    posts = _.map @postReq().keys(), (name) =>
      [
        name
        @postReq() name
      ]

    # Include drafts if we're not in prod
    drafts = if process.env.NODE_ENV isnt 'production'
      _.map @draftReq()?.keys(), (name) =>
        [
          name
          _. assign draft: true, @draftReq() name
        ]
    else []

    # Build some nice objects from the files
    _.each posts.concat(drafts), (fileArr) ->

      # Name is on format ./YYYY-MM-DD-url_title.md
      # TODO Configurable file name standard

      fileName = fileArr[0].slice 2 # Remove the "./"
      file = fileArr[1]

      processedFile = processPost file, fileName

      returnObj[processedFile.url] = processedFile
    returnObj

  allPages: ->
    # TODO allow hooks on page processing
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
    require.context 'pages', false

  postReq: ->
    require.context 'posts', false, /^\.\/.*\.md$/

  draftReq: ->
    try
      return require.context 'drafts', false, /^\.\/.*\.md$/
    catch err
      return null

  renderContent: (content) ->
    MdHelper.render content

processPost = (file, fileName) ->
    # TODO Implement nicer hooks to configurable functions

    #Clean the filename to get the url
    url = themeFunctions?.url?(file, fileName) or fileName.slice 0, fileName.length - 3

    # Get the date from the file name if it's not in the frontmatter
    date = themeFunctions?.date?(file, fileName) or (file.date or fileName.slice 0, 10)

    # Get the content
    content = MdHelper.render file.__content

    # Generate the preview
    preview = themeFunctions?.preview?(file, fileName) or (file.preview or MdHelper.getContentPreview file.__content)

    _.assign {}, file, {
      url
      content
      date
      preview
    }
