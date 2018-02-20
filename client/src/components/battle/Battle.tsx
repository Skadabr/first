import React from "react";
import { connect } from "react-redux";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import { UnitTypes } from "../../constants";

import Deck from "./Deck";
import TurnButton from "./TurnButton";
import Positions from "./Positions";
import Position from "./Position";
import DropPosition from "./DropPosition";
import Pocket from "./Pocket";
import Hero from "./Hero";

import { onTurn, addUnit, Player } from "../../actions/battle";

import {
  playerSelector,
  playerOpponentSelector,
  isTurnOwnerSelector
} from "../../selectors/battle";

interface BattlePropTypes {
  player: Player;
  opponent: Player;
  turn: boolean;

  onTurn: Function;
  addUnit: Function;
}

export class Battle extends React.Component<BattlePropTypes> {
  addUnit = unit_data => {
    const { money } = this.props.player;
    const { owner_name, position, unit } = unit_data;

    this.props.addUnit(unit.type, position);
  };

  onTurn = () => {
    const { turn, player, opponent } = this.props;

    if (!turn) return;

    //this.props.onTurn(my_gamer.name, my_warriors);
  };

  //componentWillReceiveProps(nextProps) {
  //  if (/* turn off */ this.props.turn && !nextProps.turn) {
  //    const { my_gamer, my_warriors, onTurn } = nextProps;
  //    onTurn(my_gamer.name, my_warriors);
  //  }
  //}

  render() {
    const { turn, player, opponent } = this.props;

    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div className="card Board">
          <div className="card-header">
            <Hero hero={opponent.hero} />
            <Pocket money={opponent.money} />
            <div style={{ float: "right" }}>
              <TurnButton onTurn={this.onTurn} turn={!turn} />
            </div>
          </div>

          <div className="card-body">
            <Positions
              owner_name={opponent.user.name}
              units={opponent.units}
              submit={this.addUnit}
              box={Position}
            />
            <div style={{ minHeight: 10, backgroundColor: "#eef" }} />
            <Positions
              owner_name={player.user.name}
              units={player.units}
              submit={this.addUnit}
              box={DropPosition}
            />
          </div>

          <div className="card-header">
            <Hero hero={player.hero} />
            <Pocket money={player.money} />
            <div style={{ float: "right" }}>
              <TurnButton onTurn={this.onTurn} turn={turn} />
            </div>
          </div>

          <div
            className="card-body"
            onDragStart={stopPropagationIfTurnedOff}
            onClick={stopPropagationIfTurnedOff}
          >
            <Deck />
          </div>
        </div>
      </DragDropContextProvider>
    );

    function stopPropagationIfTurnedOff(ev) {
      if (!turn) ev.stopPropagation();
    }
  }
}

function mapStateToProps(state) {
  const player = playerSelector(state);
  const opponent = playerOpponentSelector(state);
  return { player, opponent, turn: isTurnOwnerSelector(state) };
}

export default connect(mapStateToProps, {
  onTurn,
  addUnit
})(Battle as any);
