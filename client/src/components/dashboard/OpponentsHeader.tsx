import React from "react";

import { StateKinds } from "../../constants";

interface PropTypes {
  toggle: (any) => any;
  user_status: StateKinds;
}

const colors = {
  [StateKinds.PEACE]: "badge badge-success",
  [StateKinds.READY]: "badge badge-warning",
  [StateKinds.FIGHT]: "badge badge-danger"
};


export default class OpponentsHeader extends React.Component<PropTypes> {
  render() {
    const { toggle, user_status } = this.props;

    return (
      <div>
        <span>Opponents</span>
        <span
          id="user_status_badge"
          onClick={toggle}
          className={colors[user_status]}
          style={{ float: "right" }}
        >
          {user_status.toLowerCase()}
        </span>
      </div>
    );
  }
}
