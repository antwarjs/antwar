React = require('react')
moment = require('moment')

{ div, time, header, h1 } = require 'react-coffee-elements'

module.exports = React.createClass

	displayName: 'Moment'

	getDefaultProps: ->
		format: 'D MMM YYYY'
		style: {}

	propTypes:
		datetime: React.PropTypes.string.isRequired
		format: React.PropTypes.string

	render: ->
		time
			dateTime: @props.datetime
			className: @props.className
		,
			moment @props.datetime
				.format @props.format
