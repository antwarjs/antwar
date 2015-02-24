React = require('react')
Router = require('react-router')
PathsMixin = require('./PathsMixin.coffee');
Link = React.createFactory Router.Link
_ = require 'lodash'

{ nav, div, a } = require 'react-coffee-elements'

module.exports = React.createClass

	displayName: 'Nav'

	mixins: [ PathsMixin ]

	render: ->
		nav {className: 'nav'},
			_.map @getAllPages(), (page) ->
				Link
					className: 'nav__link'
					to: page.url
				, page.title
