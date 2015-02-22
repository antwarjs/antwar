var moment = require('moment'),
  React = require('react');

var Moment = React.createClass({

  getDefaultProps: function() {
    return {
      format: 'D MMM YYYY',
      style: {}
    };
  },

  propTypes: {
    datetime: React.PropTypes.string.isRequired,
    format: React.PropTypes.string,
    style: React.PropTypes.object
  },

  render: function() {
    return (
      <time dateTime="{this.props.datetime}" style={this.props.style}>{moment(this.props.datetime).format(this.props.format)}</time>
    );
  }
});

module.exports = Moment;
