import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { ME, OPPONENT } from "../../../state/game.state";
import { GameType } from "../types";

export class BattleField extends React.Component {
  static propTypes = {
    game: GameType
  };

  render() {
    const { game } = this.props;
    const opponent = game[OPPONENT];
    const me = game[ME];
    const myWarriors = game[ME].warriors;
    const opponentWarriors = game[OPPONENT].warriors;

    return (
      <div id="battle_field" className="card">
        <div id="opponent_game_stats" className="card-header" data-health={opponent.health}>
          {opponent.name}: {opponent.health}
        </div>
        <div
          id="opponent_warriors_positions"
          className="card-block"
          style={{ display: "flex", flexDirection: "row" }}
        >
          {[...getWarriorLogos(opponentWarriors)]}
        </div>
        <div
          id="my_warriors_positions"
          className="card-block"
          style={{ display: "flex", flexDirection: "row" }}
        >
          {[...getWarriorLogos(myWarriors)]}
        </div>
        <div id="my_game_stats" data-health={me.health} className="card-footer">
          {me.name}: {me.health}
        </div>
      </div>
    );
  }
}

function* getWarriorLogos(warriors) {
  for (let i = 0; i < 9; i++) {
    const w = warriors.find(w => w.position === i);
    if (w) {
      yield (
        <div key={i} style={{ maxWidth: "10%", minWidth: "10%" }}>
          <strong className="primary-font">{w.type}</strong>
          <small className="float-right text-muted">
            {w.health} / {w.damage}
          </small>
        </div>
      );
    } else {
      yield <div key={i} style={{ maxWidth: "10%", minWidth: "10%" }} />;
    }
  }
}

function mapStateToProps(state) {
  return {
    game: state.game
  };
}

export default connect(mapStateToProps)(BattleField);
