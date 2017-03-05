import React from 'react';
import classnames from 'classnames';

const Interactive = ({ id, component, containerProps = {}, ...props }) => {
  const { className, ...remainingContainerProps } = containerProps;
  const mergedClassName = classnames('interactive', className);

  if (__DEV__) {
    return (
      <div className={mergedClassName} {...remainingContainerProps}>
        {React.createElement(component, props)}
      </div>
    );
  }

  return (
    <div
      className={mergedClassName}
      id={id}
      {...remainingContainerProps}
      data-props={JSON.stringify(props)}
    />
  );
};
Interactive.propTypes = {
  id: React.PropTypes.string.isRequired,
  component: React.PropTypes.any.isRequired
};

export default Interactive;
