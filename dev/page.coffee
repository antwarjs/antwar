React = require 'react'
Router = require 'react-router'
Routes = require '../elements/Routes.coffee'

module.exports = (req) ->
	html = undefined
	Router.run Routes, req.url, (Handler) ->
		html = React.renderToString(React.createElement(Handler, null))
	html
