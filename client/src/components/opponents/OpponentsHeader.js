import React from "react";
import PropTypes from "prop-types";
import { PEACE, READY, FIGHT } from "../../state/user.state";

const colors = {
  peace: "badge badge-success",
  ready: "badge badge-warning",
  fight: "badge badge-danger"
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
        { user_status }
        </span>
      </div>
    );
  }
}
