import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  EMPTY,
  ME,
  OPPONENT,
  addWarrior,
  toTurn
} from "../../../state/game.state";
import { eliminateStatus } from "../../../state/user.state";
import { GameType } from "../types";

import BattleField from "./BattleField";
import WarriorList from "./WarriorList";
import Turn from "./Turn";

const EMPTY_STATE = {
  error: ""
};

export class GameBoard extends React.Component {
  static propTypes = GameType;

  state = EMPTY_STATE;

  addWarrior = data => {
    const { turn, me, addWarrior } = this.props;
    let { type, health, damage, price } = data;
    health = health | 0;
    damage = damage | 0;
    price = price | 0;

    if (!turn) return;
    if (me.money < price) {
      return this.setState({
        error: "You have no enough money to apply this warrior"
      });
    }

    this.props.addWarrior(me, { type, health, damage, price });
  };

  onTurn = () => {
    const { turn, toTurn, me, opponent } = this.props;
    if (!turn) return;

    toTurn(me, opponent);
  };

  eliminateStatus = () => {
    this.props.eliminateStatus();
  }

  render() {
    const { fight, turn, me, opponent, status } = this.props;
    const { error } = this.state;

    if (!fight) {
      if (status === "win") {
        return (
          <div className="alert alert-danger">
            You are a winner <button onClick={this.eliminateStatus} className="close">&times;</button>
          </div>
        );
      }
      if (status === "lose") {
        return (
          <div className="alert alert-danger">
            You are a loser <button onClick={this.eliminateStatus} className="close">&times;</button>
          </div>
        );
      }
      if (status === "break") {
        return (
          <div className="alert alert-danger">
            Game process was broken <button onClick={this.eliminateStatus} className="close">&times;</button>
          </div>
        );
      }
      return null;
    }

    return (
      <div id="game_board" className="board card-group">
        <div className="col-9 board">
          <BattleField me={me} opponent={opponent} />
        </div>
        <div className="col-3">
          <div className="card">
            <Turn onTurn={this.onTurn} turn={turn} />
            <WarriorList submit={this.addWarrior} />
            {error.length > 0 && (
              <div className="alert alert-danger">{error}</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    fight: state.game !== EMPTY,
    turn: state.game.turn,
    status: state.user.last_fight_status,
    me: state.game[ME],
    opponent: state.game[OPPONENT]
  };
}

export default connect(mapStateToProps, { addWarrior, toTurn, eliminateStatus })(GameBoard);
