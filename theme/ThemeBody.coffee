React = require 'react'
Nav = React.createFactory require './Nav'

{ div, main } = require 'react-coffee-elements'

module.exports = React.createClass

	displayName: 'ThemeBody'


	render: ->
		div { },
			Nav()
			main { role: 'main' }, @props.children
