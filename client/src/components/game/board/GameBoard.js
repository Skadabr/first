import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

//import { GameType } from "../types";

import WarriorList from "./WarriorList";
import GamerStats from "./GamerStats";
import TurnButton from "./TurnButton";
import Positions from "./Positions";
import Position from "./Position";
import PositionToDrop from "./PositionToDrop";

import { warriorsAdd } from "../../../actions/warriors";

import {
  myGamerSelector,
  opponentGamerSelector
} from "../../../selectors/gamers";
import {
  myWarriorsSelector,
  opponentWarriorsSelector
} from "../../../selectors/warriors";

import { myTurnSelector } from "../../../selectors/game";

export class GameBoard extends React.Component {
  //static propTypes = GameType;

  state = {
    money: 1,
    error: ""
  };

  addWarrior = ({ owner_name, position, warrior }) => {
    const { type, price } = warrior;
    const { money } = this.state;

    if (price > money) {
      alert("You don't have enough money");
      return;
    }

    this.setState(prev => ({ ...prev, money: prev.money - price }));
    this.props.warriorsAdd(owner_name, position, type);
  };

  onTurn = () => {
    const { turn } = this.props;
    if (!turn) return;

    console.log("TURN");

    //toTurn(me, opponent);
  };

  //eliminateStatus = () => {
  //  this.props.eliminateStatus();
  //}

  render() {
    const {
      turn,
      my_gamer,
      opponent_gamer,
      my_warriors,
      opponent_warriors,
      status
    } = this.props;
    const { error, energy } = this.state;

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
        <div id="game_board" className="row">
          <div className="col-9 Board">
            <GamerStats {...opponent_gamer} />
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
            <GamerStats {...my_gamer} />
          </div>

          <div
            className="col-3"
            onDragStart={ev => {
              if (!turn) ev.stopPropagation();
            }}
            onClick={ev => {
              if (!turn) ev.stopPropagation();
            }}
          >
            <div className="card">
              <TurnButton turn={turn} onTurn={this.onTurn} />
              <WarriorList />
              {error.length > 0 && (
                <div className="alert alert-danger">{error}</div>
              )}
            </div>
          </div>
        </div>
      </DragDropContextProvider>
    );
    //<Turn onTurn={this.onTurn} turn={turn} />
    //return <divclassName="board card-group" />;
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

export default connect(mapStateToProps, { warriorsAdd })(GameBoard);
