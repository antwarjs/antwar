import React from 'react';

const Interactive = ({ id, component }) => {
  if (__DEV__) {
    return <div>{React.createElement(component)}</div>;
  }

  return <div className="interactive" id={id} />;
};
Interactive.propTypes = {
  id: React.PropTypes.string.isRequired,
  component: React.PropTypes.any.isRequired
};

export default Interactive;
