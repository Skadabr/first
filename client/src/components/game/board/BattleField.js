import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { POSITIONS } from "../../../constants";
//import { GamerType } from "../types";
//
import Position from "./Position";
//
export default class BattleField extends React.Component {
//static propTypes = {
//  me: GamerType,
//  opponent: GamerType
//};

  render() {
    const { my_gamer, opponent_gamer, my_warriors, opponent_warriors } = this.props;
//  const myWarriors = me.warriors;
//  const opponentWarriors = opponent.warriors;

    return (
      <div id="battle_field" className="card">
        <div
          className="card-header GamerStats"
          data-health={opponent_gamer.health}
        >
          {opponent_gamer.name}: {opponent_gamer.health}
        </div>

        <div
          id="my_warriors_positions"
          className="card-block"
          style={{ display: "flex", flexDirection: "row" }}
        >
          {[...getWarriorLogos(my_warriors)]}
        </div>

        <div id="my_game_stats" data-health={my_gamer.health} className="card-footer">
          {my_gamer.name}: {my_gamer.health}
        </div>
      </div>
    );
//      <div
//        id="opponent_warriors_positions"
//        className="card-block"
//        style={{ display: "flex", flexDirection: "row" }}
//      >
//        {[...getWarriorLogos(opponentWarriors)]}
//      </div>
  }
}

function* getWarriorLogos(warriors) {
  const width = 100 / POSITIONS;

  for (let i = 0; i < POSITIONS; i++) {
    const w = warriors.find(w => w.position === i);
    yield <Position key={i} width={width} warrior={w} />;
  }
}
