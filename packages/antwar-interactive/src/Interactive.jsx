import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

const Interactive = ({ id, component, containerProps = {}, ...props }) => {
  const { className, ...remainingContainerProps } = containerProps;
  const mergedClassName = classnames("interactive", className);

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
  id: PropTypes.string.isRequired,
  component: PropTypes.any.isRequired,
};

export default Interactive;
