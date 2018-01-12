import React from "react";
import PropTypes from "prop-types";

export default class OpponentsHeader extends React.Component {
  render() {
    const { toggle, active } = this.props;
    const className = active ? "badge badge-success" : "badge badge-danger";

    return (
      <div>
        <span>Opponents</span>
        <span className="UserStatus" onClick={toggle} className={className} style={{float: 'right'}}>
          {active ? "on" : "off"}
        </span>
      </div>
    );
  }
}
