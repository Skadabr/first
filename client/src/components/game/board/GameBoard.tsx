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

import { onTurn, addWarrior } from "../../../actions/battle";

import {
  myGamerSelector,
  opponentGamerSelector
} from "../../../selectors/gamers";
import {
  myWarriorsSelector,
  opponentWarriorsSelector
} from "../../../selectors/warriors";
import { myTurnSelector } from "../../../selectors/game";

interface GameBoardPropTypes {
  my_gamer: any;
  opponent_gamer: any;
  my_warriors: any;
  opponent_warriors: any;
  turn: boolean;

  onTurn: Function;
  addWarrior: Function;
}

interface AddWarriorInput {
  owner_name: string;
  position: number;
  warrior: { kind: WarriorKinds };
}

export class GameBoard extends React.Component<GameBoardPropTypes> {
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

  //eliminateStatus = () => {
  //  this.props.eliminateStatus();
  //}

  render() {
    const {
      turn,
      my_gamer,
      opponent_gamer,
      my_warriors,
      opponent_warriors
    } = this.props;

    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div className="card Board">
          <div className="card-header">
            <div style={{ float: "left" }}>
              <GamerStats {...opponent_gamer} turn={!turn} />
            </div>
            <div style={{ float: "right" }}>
              <TurnButton onTurn={this.onTurn} turn={turn} />
            </div>
          </div>

          <div className="card-body">
            <Positions
              owner_name={opponent_gamer.name}
              warriors={opponent_warriors}
              submit={this.addWarrior}
              box={Position}
            />
            <div style={{ minHeight: 10, backgroundColor: "#eef" }} />
            <Positions
              owner_name={my_gamer.name}
              warriors={my_warriors}
              submit={this.addWarrior}
              box={PositionToDrop}
            />
          </div>

          <div className="card-header">
            <GamerStats {...my_gamer} turn={turn} />
          </div>

          <div className="card-body">
            <div
              onDragStart={stopPropagationIfTurnedOff}
              onClick={stopPropagationIfTurnedOff}
            >
              <div className="card">
                <WarriorList />
              </div>
            </div>
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
  return {
    my_gamer: myGamerSelector(state),
    opponent_gamer: opponentGamerSelector(state),
    my_warriors: myWarriorsSelector(state),
    opponent_warriors: opponentWarriorsSelector(state),
    turn: myTurnSelector(state)
  };
}

export default connect(mapStateToProps, {
  onTurn,
  addWarrior
})(GameBoard as any);
