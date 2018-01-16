import React from "react";
import PropTypes from "prop-types";
import { PEACE, READY, FIGHT } from "../../state/user.state";

const colors = {
  [PEACE]: "badge badge-success",
  [READY]: "badge badge-warning",
  [FIGHT]: "badge badge-danger"
};

export default class OpponentsHeader extends React.Component {
  render() {
    const { toggle, user_status } = this.props;

    return (
      <div>
        <span>Opponents</span>
        <span
          onClick={toggle}
          className={colors[user_status]}
          style={{ float: "right" }}
        >
        { user_status.toLowerCase() }
        </span>
      </div>
    );
  }
}

OpponentsHeader.propTypes = {
  toggle: PropTypes.func.isRequired,
  user_status: PropTypes.string.isRequired,
}
