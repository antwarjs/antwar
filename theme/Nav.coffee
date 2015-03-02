React = require 'react'
Router = require 'react-router'
PathsMixin = require '../elements/PathsMixin.coffee'
Link = React.createFactory Router.Link
_ = require 'lodash'

{ nav, div, a } = require 'react-coffee-elements'

module.exports = React.createClass

	displayName: 'Nav'

	mixins: [ PathsMixin ]

	render: ->
		nav {className: 'nav'},
				Link
					className: 'nav__link'
					to: '/'
				, 'Home'
				Link
					className: 'nav__link'
					to: 'blog'
				, 'Blog'
