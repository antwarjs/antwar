import React from 'react';

const Interactive = ({ id, component, ...props }) => {
  if (__DEV__) {
    return <div>{React.createElement(component, props)}</div>;
  }

  return <div className="interactive" id={id} data-props={JSON.stringify(props)} />;
};
Interactive.propTypes = {
  id: React.PropTypes.string.isRequired,
  component: React.PropTypes.any.isRequired
};

export default Interactive;
