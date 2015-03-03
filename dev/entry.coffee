React = require 'react'
Router = require 'react-router'
Routes = require '../elements/Routes.coffee'

Router.run Routes, Router.HistoryLocation, (Handler) ->
	React.render React.createElement(Handler, {}), document.body
