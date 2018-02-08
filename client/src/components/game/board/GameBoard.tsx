import React from "react";
import { connect } from "react-redux";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import WarriorList from "./WarriorList";
import GamerStats from "./GamerStats";
import TurnButton from "./TurnButton";
import Positions from "./Positions";
import Position from "./Position";
import PositionToDrop from "./PositionToDrop";

import { warriorsAdd } from "../../../actions/warriors";
import { gameTurnOff } from "../../../actions/game";
import { gamerIncreaseMoney } from "../../../actions/gamers";
import { oneSideKickOtherSide, passTheTurn } from "../../../actions/battle";

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
  gamerIncreaseMoney: Function;
}

interface StateTypes {
  error: string;
  money: number;
}

export class GameBoard extends React.Component<PropTypes, StateTypes> {
  constructor(props) {
    super(props);

    this.state = {
      money: props.my_gamer.money,
      error: ""
    };
  }

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
    const {
      turn,
      my_gamer,
      opponent_gamer,
      my_warriors,
      opponent_warriors
    } = this.props;
    const {
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
    const { error } = this.state;

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
  gamerIncreaseMoney
})(GameBoard);
