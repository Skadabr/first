import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
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
import Unit from "./Unit";
import Card from "./Card";
import UnitCardView from "./UnitCardView";

import { onTurn, addUnit } from "../../actions/battle_process";

import {validateAddUnitParams} from "../../validators/battle";

import {
  playerSelector,
  playerOpponentSelector,
  isTurnOwnerSelector,
  isBattleStartedSelector,
  playerDeckSelector,
  opponentDeckSelector,
  playerUnitsSelector,
  opponentUnitsSelector,
  playerHeroSelector,
  opponentHeroSelector
} from "../../selectors/battle";

interface BattlePropTypes {
  player: any;
  opponent: any;
  playerDeck: any;
  opponentDeck: any;
  playerUnits: any;
  opponentUnits: any;
  playerHero: any;
  opponentHero: any;
  isTurnOwner: boolean;
  isBattleStarted: boolean;

  onTurn: Function;
  addUnit: Function;
}

export class Battle extends React.Component<BattlePropTypes> {
  addUnit = ({ position, card }) => {
    const player = this.props.player;

    const {error} = validateAddUnitParams(card, player, position);

    if (error) {
      //.......
      console.error(error.message);
      return;
    }

    this.props.addUnit(card, position, player);
  };

  onTurn = () => {
    const { isTurnOwner, player, opponent } = this.props;

    if (!isTurnOwner) return;

    //this.props.onTurn(my_gamer.name, my_warriors);
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
      playerDeck,
      opponentDeck,
      playerUnits,
      opponentUnits,
      playerHero,
      opponentHero
    } = this.props;

    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div className="card Board">
          <div className="card-body">
            <Deck deck={opponentDeck} box={UnitCardView} />
          </div>

          <div className="card-header">
            <Hero hero={opponentHero} />
            <Pocket money={opponent.money} />
            <div style={{ float: "right" }}>
              <TurnButton onTurn={this.onTurn} turn={!isTurnOwner} />
            </div>
          </div>

          <div className="card-body">
            <Positions
              owner_name={opponent.user.name}
              units={opponentUnits}
              onAddUnit={noop}
              boxComponent={Position}
            />

            <div style={{ minHeight: 10, backgroundColor: "#eef" }} />

            <Positions
              owner_name={player.user.name}
              units={playerUnits}
              onAddUnit={this.addUnit}
              boxComponent={DropPosition}
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
            <Deck deck={playerDeck} box={Card} />
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
  const isBattleStarted = isBattleStartedSelector(state);
  const isTurnOwner = isTurnOwnerSelector(state);

  const player = playerSelector(state);
  const opponent = playerOpponentSelector(state);

  const playerDeck = playerDeckSelector(state);
  const opponentDeck = opponentDeckSelector(state);

  const playerUnits = playerUnitsSelector(state);
  const opponentUnits = opponentUnitsSelector(state);

  const playerHero = playerHeroSelector(state);
  const opponentHero = opponentHeroSelector(state);

  return {
    isBattleStarted,
    isTurnOwner,

    player,
    opponent,
    playerDeck,
    opponentDeck,
    playerUnits,
    opponentUnits,
    playerHero,
    opponentHero
  };
}

function noop() {}

export default connect(mapStateToProps, {
  onTurn,
  addUnit
})(Battle as any);
