'use strict';
var React = require('react');
import config from 'config';

module.exports = React.createClass({
  displayName: 'DevIndex',
  render() {
    const props = {
      config,
      section: {},
      page: {},
      location: this.props.location
    };
    const Body = config.layout();

    return (
      <Body {...props}>
        <div id="dev-container" />
      </Body>
    );
  }
});
