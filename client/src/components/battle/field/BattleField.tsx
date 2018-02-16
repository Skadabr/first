import React from "react";
import { connect } from "react-redux";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import { WarriorKinds } from "../../../constants";

import WarriorList from "./WarriorList";
import GamerStats from "./GamerStats";
import TurnButton from "./TurnButton";
import Positions from "./Positions";
import Position from "./Position";
import PositionToDrop from "./PositionToDrop";

import { onTurn, addWarrior, Player } from "../../../actions/battle";

import {
  myGamerSelector,
  opponentGamerSelector
} from "../../../selectors/gamers";
import {
  myWarriorsSelector,
  opponentWarriorsSelector
} from "../../../selectors/warriors";
import { myTurnSelector } from "../../../selectors/game";

interface BattleFieldPropTypes {
  player: Player;
  opponent: Player;
  turn: boolean;

  onTurn: Function;
  addWarrior: Function;
}

// interface AddWarriorInput {
//   owner_name: string;
//   position: number;
//   warrior: { kind: WarriorKinds };
// }

export class BattleField extends React.Component<BattleFieldPropTypes> {
  addWarrior = (warrior_data: AddWarriorInput) => {
    const { money } = this.props.my_gamer;
    const { owner_name, position, warrior } = warrior_data;

    this.props.addWarrior(warrior.kind, position);
  };

  onTurn = () => {
    const { turn, my_gamer, my_warriors } = this.props;

    if (!turn) return;

    this.props.onTurn(my_gamer.name, my_warriors);
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
              warriors={player.units}
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
        </div>
      </DragDropContextProvider>
    );

    //  <div className="card-body">
    //    <div
    //      onDragStart={stopPropagationIfTurnedOff}
    //      onClick={stopPropagationIfTurnedOff}
    //    >
    //      <div className="card">
    //        <WarriorList />
    //      </div>
    //    </div>
    //  </div>

    function stopPropagationIfTurnedOff(ev) {
      if (!turn) ev.stopPropagation();
    }
  }
}

function mapStateToProps(state) {
  return {
    user: playerSelector(state),
    opponent: playerOpponentSelector(state),
    turn: turnSelector(state)
  };
}

export default connect(mapStateToProps, {
  onTurn,
  addWarrior
})(GameBoard as any);
