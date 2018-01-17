import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { EMPTY, ME, addWarrior } from "../../../state/game.state";

import BattleField from "./BattleField";
import WarriorList from "./WarriorList";

class GameBoard extends React.Component {
  addWarrior = data => {
    let { type, health, damage } = data;
    health = health | 0;
    damage = damage | 0;
    this.props.addWarrior(ME, this.props.game, { type, health, damage });
  };

  render() {
    const { fight, game } = this.props;

    if (!fight) return null;

    return (
      <div className="board card-group">
        <div className="col-9">
          <BattleField game={game} />
        </div>
        <div className="col-3">
          <Turn >
          <WarriorList submit={this.addWarrior} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    fight: state.game !== EMPTY,
    game: state.game
  };
}

export default connect(mapStateToProps, { addWarrior })(GameBoard);
