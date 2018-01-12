import React from "react";
import PropTypes from "prop-types";

export default class OpponentsHeader extends React.Component {
  render() {
    const {toggle, active} = this.props;

    return (
        <div>
          <div>Opponents</div>
          <div className="UserStatus" onClick={toggle}>
            {active ? "active" : "nonactive"}
          </div>
        </div>
    );
  }
}
