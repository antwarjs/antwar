React = require 'react'
Nav = React.createFactory require './Nav'

{ div, main } = require 'react-coffee-elements'

module.exports = React.createClass

	displayName: 'Body'


	render: ->
		div { },
			Nav()
			main { role: 'main' }, @props.children
