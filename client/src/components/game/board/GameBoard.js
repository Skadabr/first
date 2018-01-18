import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { EMPTY, ME, addWarrior, toTurn } from "../../../state/game.state";

import BattleField from "./BattleField";
import WarriorList from "./WarriorList";
import Turn from "./Turn";

class GameBoard extends React.Component {
  addWarrior = data => {
    const { game, addWarrior } = this.props;
    if (!game.turn) return;

    let { type, health, damage } = data;
    health = health | 0;
    damage = damage | 0;
    this.props.addWarrior(ME, this.props.game, { type, health, damage });
  };

  onTurn = () => {
    const { game, toTurn } = this.props;
    if (!game.turn) return;

    //toTurn()

  }

  render() {
    const { fight, game } = this.props;

    if (!fight) return null;

    return (
      <div className="board card-group">
        <div className="col-9">
          <BattleField game={game} />
        </div>
        <div className="col-3">
          <div className="card">
            <Turn onTurn={this.onTurn} turn={game.turn} />
            <WarriorList submit={this.addWarrior} />
          </div>
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

export default connect(mapStateToProps, { addWarrior, toTurn })(GameBoard);
