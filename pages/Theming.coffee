React = require('react')
_ = require('lodash')

{ div, p, h1 } = require 'react-coffee-elements'

module.exports = React.createClass

	displayName: 'Theming'

	render: ->
		div {},
			h1 'Theming'
			p 'Theming in antwar is pretty simple. Three files are required: main.scss, ThemeBody and Post.'

