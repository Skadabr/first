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

import { warriorsAdd } from "../../../actions/warriors";
import { gameTurnOff } from "../../../actions/game";
import {
  oneSideKickOtherSide,
  passTheTurn,
  addWarrior
} from "../../../actions/battle";

import {
  myGamerSelector,
  opponentGamerSelector
} from "../../../selectors/gamers";
import {
  myWarriorsSelector,
  opponentWarriorsSelector
} from "../../../selectors/warriors";
import { myTurnSelector } from "../../../selectors/game";

interface PropTypes {
  my_gamer: any;
  opponent_gamer: any;
  my_warriors: any;
  opponent_warriors: any;
  turn: boolean;
  warriorsAdd: Function;

  oneSideKickOtherSide: Function;
  passTheTurn: Function;
  gameTurnOff: Function;
  addWarrior: Function;
}

interface AddWarriorInput {
  owner_name: string;
  position: number;
  warrior: { kind: WarriorKinds };
}

export class GameBoard extends React.Component<PropTypes> {
  addWarrior = (warrior_data: AddWarriorInput) => {
    const { money } = this.props.my_gamer;
    const { owner_name, position, warrior } = warrior_data;

    //  TODO: it should be calculated on the server
    //  if (price > money) {
    //    alert("You don't have enough money");
    //    return;
    //  }

    this.props.addWarrior(warrior.kind, position);
    //  this.setState(prev => ({ ...prev, money: prev.money - price }));
    //  this.props.warriorsAdd(owner_name, position, type);
  };

  onTurn = () => {
    const {
      turn,
      my_gamer,
      opponent_gamer,
      my_warriors,
      opponent_warriors

      oneSideKickOtherSide,
      gameTurnOff,
      gamerIncreaseMoney
    } = this.props;

    if (!turn) return;

    oneSideKickOtherSide(my_warriors, opponent_gamer, opponent_warriors);
    gameTurnOff();
    this.setState(prev => ({ ...prev, money: my_gamer.money + 1 }));
    gamerIncreaseMoney(my_gamer.name);
    this.setState({});
  };

  componentWillReceiveProps(nextProps) {
    if (/* turn off */ this.props.turn && !nextProps.turn) {
      const {
        my_gamer,
        opponent_gamer,
        my_warriors,
        opponent_warriors,
        passTheTurn
      } = nextProps;
      passTheTurn(
        { ...my_gamer, warriors: my_warriors },
        { ...opponent_gamer, warriors: opponent_warriors }
      );
    }
  }

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

    //  if (!fight) {
    //    if (status === "win") {
    //      return (
    //        <div className="alert alert-danger">
    //          You are a winner <button onClick={this.eliminateStatus} className="close">&times;</button>
    //        </div>
    //      );
    //    }
    //    if (status === "lose") {
    //      return (
    //        <div className="alert alert-danger">
    //          You are a loser <button onClick={this.eliminateStatus} className="close">&times;</button>
    //        </div>
    //      );
    //    }
    //    if (status === "break") {
    //      return (
    //        <div className="alert alert-danger">
    //          Game process was broken <button onClick={this.eliminateStatus} className="close">&times;</button>
    //        </div>
    //      );
    //    }
    //    return null;
    //  }

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
  warriorsAdd,
  oneSideKickOtherSide,
  passTheTurn,
  gameTurnOff,
  addWarrior
})(GameBoard as any);
