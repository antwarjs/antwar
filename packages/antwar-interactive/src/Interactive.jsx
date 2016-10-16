import React from 'react';

const Interactive = ({ id, component, containerProps, ...props }) => {
  if (__DEV__) {
    return (
      <div className="interactive" {...containerProps}>
        {React.createElement(component, props)}
      </div>
    );
  }

  return (
    <div
      className="interactive"
      id={id}
      {...containerProps}
      data-props={JSON.stringify(props)}
    />
  );
};
Interactive.propTypes = {
  id: React.PropTypes.string.isRequired,
  component: React.PropTypes.any.isRequired
};

export default Interactive;
