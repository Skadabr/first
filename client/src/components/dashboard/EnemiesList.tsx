import React from "react";

import { UserStatusType } from "core";

interface PropTypes {
  enemys: { name: string; status: string }[];
}

const colors = {
  [UserStatusType.Peace]: "alert-success",
  [UserStatusType.Ready]: "alert-warning",
  [UserStatusType.Fight]: "alert-danger"
};

export default class EnemysList extends React.Component<PropTypes> {
  private board: any;

  componentDidUpdate() {
    const { board } = this;
    if (board.children.length > 0) {
      board.scrollTop = board.lastChild.offsetTop;
    }
  }

  render() {
    const { enemys } = this.props;
    return (
      <div id="enemy_list" ref={el => (this.board = el)}>
        {enemys.length > 0 &&
          enemys.map(enemy => (
            <div className="card-block" key={enemy.name}>
              <span className={colors[enemy.status]}>{enemy.name}</span>
            </div>
          ))}
      </div>
    );
  }
}
