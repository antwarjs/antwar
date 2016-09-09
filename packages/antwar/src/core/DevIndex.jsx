import React from 'react';
import config from 'config';

const DevIndex = ({ location }) => {
  const props = {
    config,
    section: {
      pages: () => []
    },
    page: {},
    location
  };

  if (!config.layout) {
    throw new Error('Missing config.layout()!');
  }

  let Body = config.layout();

  // ES6 adaptation
  if (Body.default) {
    Body = Body.default;
  }

  return (
    <Body {...props}>
      <div id="dev-container" />
    </Body>
  );
};
DevIndex.displayName = 'DevIndex';
DevIndex.propTypes = {
  location: React.PropTypes.object
};

export default DevIndex;
