import React from "react";
import PropTypes from "prop-types";

export default class Position extends React.Component {
  render() {
    const children = this.props.children;
    const width = (this.props.width | 0) + "%";

    return <div style={{ maxWidth: width, minWidth: width, minHeight: 40 }}>
        {children}
      </div>
  }
}

Position.propTypes = {
  width: PropTypes.number.isRequired
};
