React = require('react')
_ = require('lodash')
config = require '../config'

{ div, h1, h2, p } = require 'react-coffee-elements'

module.exports = React.createClass

	displayName: 'Index'

	render: ->
		div {className: 'post post--front'},
			div className: 'header-image', style: backgroundImage: 'url(/assets/img/front.jpg)'
			h1 className: 'post__heading', 'Antwar'
			div className: 'post__content',
				h2 'What?'
				p "Antwar is a static site engine. It's built with React and Webpack."
				h2 'Why?'
				p "Antwar is extremely easy to theme and extend. It's fast and simple."
				h2 'Antwar?'
				p "The Swedish word for TV static is literally translated 'Ant war'. So there's that."


