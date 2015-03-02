React = require 'react'
Router = require 'react-router'
css = require 'theme/scss/main.scss'
Routes = require '../elements/Routes.coffee'

module.exports = (url) ->
	html = undefined
	Router.run Routes, url, (Handler) ->
		html = React.renderToStaticMarkup(React.createElement(Handler, null))
	html
