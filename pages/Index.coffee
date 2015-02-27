React = require('react')
_ = require('lodash')

{ div, li, br, ul, h1, blockquote } = require 'react-coffee-elements'

module.exports = React.createClass

	displayName: 'Index'

	render: ->
		div {}, 'Index hey'

