import React from 'react';
import config from 'config';

export default class DevIndex extends React.Component {
  render() {
    const props = {
      config,
      section: {
        pages: () => []
      },
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
};
