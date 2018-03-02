import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import { UnitTypes } from "../../constants";

import Deck from "./Deck";
import TurnButton from "./TurnButton";
import OpponentPositions from "./OpponentPositions";
import PlayerPositions from "./PlayerPositions";
import Position from "./Position";
import DropPosition from "./DropPosition";
import Pocket from "./Pocket";
import Hero from "./Hero";
import Unit from "./Unit";
import Card from "./Card";
import UnitCardView from "./UnitCardView";

import {
  onTurn,
  addUnit,
  attack,
  activateUnit,
  disActivateUnit
} from "../../actions/battle_process";

import { validateAddUnitParams } from "../../validators/battle";

import {
  isTurnOwner,
  isBattleStarted,
  getPlayer,
  getOpponent,
  getPlayerHand,
  getOpponentHand,
  getPlayerUnits,
  getOpponentUnits,
  getPlayerHero,
  getOpponentHero
} from "../../selectors/battle";

interface BattlePropTypes {
  player: any;
  opponent: any;
  playerHand: any;
  opponentHand: any;
  playerUnits: any;
  opponentUnits: any;
  playerHero: any;
  opponentHero: any;
  isTurnOwner: boolean;
  isBattleStarted: boolean;

  onTurn: Function;
  addUnit: Function;
  attack: Function;
  activateUnit: Function;
  disActivateUnit: Function;
}

export class Battle extends React.Component<BattlePropTypes> {
  addUnit = ({ position, card }) => {
    const player = this.props.player;

    const { error } = validateAddUnitParams(card, player, position);

    if (error) {
      //.......
      console.error(error.message);
      return;
    }

    this.props.addUnit(card, position, player);
  };

  onTurn = () => {
    const { isTurnOwner, onTurn } = this.props;

    if (isTurnOwner) onTurn();
  };

  onActivate = unit_id => {
    this.props.activateUnit(unit_id);
  };

  onAttack = data => {
    console.error("onAttack");
    attack(data);
  };

  onDisActivate = (unit_id, isAttacking) => {
    this.props.disActivateUnit(unit_id);
  };

  //componentWillReceiveProps(nextProps) {
  //  if (/* turn off */ this.props.turn && !nextProps.turn) {
  //    const { my_gamer, my_warriors, onTurn } = nextProps;
  //    onTurn(my_gamer.name, my_warriors);
  //  }
  //}

  render() {
    const {
      isTurnOwner,
      isBattleStarted,
      player,
      opponent,
      playerHand,
      opponentHand,
      playerUnits,
      opponentUnits,
      playerHero,
      opponentHero
    } = this.props;

    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div className="card Board">
          <div className="card-body">
            <Deck deck={opponentHand} box={UnitCardView} />
          </div>

          <div className="card-header">
            <Hero hero={opponentHero} />
            <Pocket money={opponent.money} />
            <div style={{ float: "right" }}>
              <TurnButton onTurn={this.onTurn} turn={!isTurnOwner} />
            </div>
          </div>

          <div className="card-body">
            <OpponentPositions
              owner_name={opponent.user.name}
              units={opponentUnits}
              onAttack={this.onAttack}
            />

            <div style={{ minHeight: 10, backgroundColor: "#eef" }} />

            <PlayerPositions
              owner_name={player.user.name}
              units={playerUnits}
              onAddUnit={this.addUnit}
              onActivate={this.onActivate}
              onDisActivate={this.onDisActivate}
            />
          </div>

          <div className="card-header">
            <Hero hero={playerHero} />
            <Pocket money={player.money} />
            <div style={{ float: "right" }}>
              <TurnButton onTurn={this.onTurn} turn={isTurnOwner} />
            </div>
          </div>

          <div
            className="card-body"
            onDragStart={stopPropagationIfTurnedOff}
            onClick={stopPropagationIfTurnedOff}
          >
            <Deck deck={playerHand} box={Card} />
          </div>
        </div>
      </DragDropContextProvider>
    );

    function stopPropagationIfTurnedOff(ev) {
      if (!isTurnOwner) ev.stopPropagation();
    }
  }
}

function mapStateToProps(state) {
  const player = getPlayer(state);
  const opponent = getOpponent(state);

  const playerHand = getPlayerHand(state);
  const opponentHand = getOpponentHand(state);

  const playerUnits = getPlayerUnits(state);
  const opponentUnits = getOpponentUnits(state);

  const playerHero = getPlayerHero(state);
  const opponentHero = getOpponentHero(state);

  return {
    isBattleStarted: isBattleStarted(state),
    isTurnOwner: isTurnOwner(state),

    player,
    opponent,
    playerHand,
    opponentHand,
    playerUnits,
    opponentUnits,
    playerHero,
    opponentHero
  };
}

function noop() {}

export default connect(mapStateToProps, {
  onTurn,
  addUnit,
  attack,
  activateUnit,
  disActivateUnit
})(Battle as any);
