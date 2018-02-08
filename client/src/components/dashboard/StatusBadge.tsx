import React from "react";

import { StatusKinds } from "../../constants";

const colors = {
  [StatusKinds.PEACE]: "badge badge-success",
  [StatusKinds.READY]: "badge badge-warning",
  [StatusKinds.FIGHT]: "badge badge-danger"
};

const statusText = {
  [StatusKinds.PEACE]: "peace",
  [StatusKinds.READY]: "ready",
  [StatusKinds.FIGHT]: "fight"
};

interface StatusBadgePropTypes {
  toggle: (any) => void;
  user_status: StatusKinds;
}

export default class StatusBadge extends React.PureComponent<
  StatusBadgePropTypes
> {
  render() {
    const { toggle, user_status } = this.props;

    return (
      <span
        id="user_status_badge"
        onClick={toggle}
        className={colors[user_status]}
        style={{ float: "right" }}
      >
        {statusText[user_status]}
      </span>
    );
  }
}
