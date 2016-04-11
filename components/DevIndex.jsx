import React from 'react';
import config from 'config';

export default ({location}) => {
  const props = {
    config,
    section: {
      pages: () => []
    },
    page: {},
    location
  };
  const Body = config.layout();

  return (
    <Body {...props}>
      <div id="dev-container" />
    </Body>
  );
};
