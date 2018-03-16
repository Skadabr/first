import React from "react";

import { UserStatusType } from "core";

interface PropTypes {
  opponents: { name: string; status: string }[];
}

const colors = {
  [UserStatusType.Peace]: "alert-success",
  [UserStatusType.Ready]: "alert-warning",
  [UserStatusType.Fight]: "alert-danger"
};

export default class OpponentsList extends React.Component<PropTypes> {
  private board: any;

  componentDidUpdate() {
    const { board } = this;
    if (board.children.length > 0) {
      board.scrollTop = board.lastChild.offsetTop;
    }
  }

  render() {
    const { opponents } = this.props;
    return (
      <div id="opponent_list" ref={el => (this.board = el)}>
        {opponents.length > 0 &&
          opponents.map(opponent => (
            <div className="card-block" key={opponent.name}>
              <span className={colors[opponent.status]}>{opponent.name}</span>
            </div>
          ))}
      </div>
    );
  }
}
