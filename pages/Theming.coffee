React = require('react')
_ = require('lodash')

{ div, p, h1 } = require 'react-coffee-elements'

module.exports = React.createClass

	displayName: 'Theming'

	render: ->
		div {className: 'post'},
			h1 className: 'post__heading', 'Theming'
			div className: 'post__content',
				p 'Theming in antwar is pretty simple. Three files are required: main.scss, Body and Post.'

