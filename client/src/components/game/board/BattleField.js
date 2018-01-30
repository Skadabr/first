import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { ME, OPPONENT, POSITIONS } from "../../../state/game.state";
import { GamerType } from "../types";

import Position from "./Position";

export default class BattleField extends React.Component {
  static propTypes = {
    me: GamerType,
    opponent: GamerType
  };

  render() {
    const { me, opponent } = this.props;
    const myWarriors = me.warriors;
    const opponentWarriors = opponent.warriors;

    return (
      <div id="battle_field" className="card">
        <div
          id="opponent_game_stats"
          className="card-header"
          data-health={opponent.health}
        >
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
          {me.name}: {me.health} / money({me.money})
        </div>
      </div>
    );
  }
}

function* getWarriorLogos(warriors) {
  const width = 100 / POSITIONS;

  for (let i = 0; i < POSITIONS; i++) {
    const w = warriors.find(w => w.position === i);
    yield <Position key={i} width={width} warrior={w} />;
  }
}
