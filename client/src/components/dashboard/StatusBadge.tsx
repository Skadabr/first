import React from "react";

import { UserStatusType } from "../../constants";

const colors = {
  [UserStatusType.Peace]: "badge badge-success",
  [UserStatusType.Ready]: "badge badge-warning",
  [UserStatusType.Fight]: "badge badge-danger"
};

const statusText = {
  [UserStatusType.Peace]: "peace",
  [UserStatusType.Ready]: "ready",
  [UserStatusType.Fight]: "fight"
};

interface StatusBadgePropTypes {
  toggle: (any) => void;
  user_status: UserStatusType;
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
        style={{ float: "right", cursor: "pointer" }}
      >
        {statusText[user_status]}
      </span>
    );
  }
}
