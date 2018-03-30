import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import Deck from "./Deck";
import TurnButton from "./TurnButton";
import EnemyPositions from "./EnemyPositions";
import PlayerPositions from "./PlayerPositions";
import Pocket from "./Pocket";
import Hero from "./Hero";
import Card from "./Card";
import UnitCardView from "./UnitCardView";

import {
  onTurn,
  playCard,
  attack,
} from "../../actions/battle_process";
import {
  getAvailableTargets,
  getEnemy,
  getEnemyHand, getEnemyHero, getEnemyMinions,
  getPlayer, getPlayerHand, getPlayerHero, getPlayerMinions,
  isBattleStarted,
  isPlayerTurnOwner
} from "../../selectors/battle";

interface BattlePropTypes {
  player: any;
  enemy: any;
  playerHand: any;
  enemyHand: any;
  playerMinions: any;
  enemyMinions: any;
  playerHero: any;
  enemyHero: any;
  isTurnOwner: boolean;
  isBattleStarted: boolean;
  availableTargets: boolean;

  onTurn: Function;
  placyCard: Function;
  attack: Function;
  activateUnit: Function;
  disActivateUnit: Function;
}

export class Battle extends React.Component<BattlePropTypes> {
  playCard = ({ position, card }) => {
    const player = this.props.player;

    this.props.placyCard(card, position, player);
  };

  onTurn = () => {
    const { isTurnOwner, onTurn } = this.props;

    if (isTurnOwner) onTurn();
  };

  onActivate = unit_id => {
    this.props.activateUnit(unit_id);
  };

  onAttack = data => {
    this.props.attack(data);
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
      player,
      enemy,
      playerHand,
      enemyHand,
      playerMinions,
      enemyMinions,
      playerHero,
      enemyHero,
      availableTargets
    } = this.props;

    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div className="card Board">
          <div className="card-body">
            <Deck deck={enemyHand} box={UnitCardView} />
          </div>

          <div className="card-header">
            <Hero hero={enemyHero} />
            <Pocket money={enemy.money} />
            <div style={{ float: "right" }}>
              <TurnButton onTurn={noop} turn={!isTurnOwner} />
            </div>
          </div>

          <div className="card-body">
            <EnemyPositions
              owner_name={enemy.user.name}
              units={enemyMinions}
              availableTargets={availableTargets}
              onAttack={this.onAttack}
            />

            <div style={{ minHeight: 10, backgroundColor: "#eef" }} />

            <PlayerPositions
              owner_name={player.user.name}
              units={playerMinions}
              onAddUnit={this.playCard}
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
  const enemy = getEnemy(state);

  const playerHand = getPlayerHand(state);
  const enemyHand = getEnemyHand(state);

  const playerMinions = getPlayerMinions(state);
  const enemyMinions = getEnemyMinions(state);

  const playerHero = getPlayerHero(state);
  const enemyHero = getEnemyHero(state);

  const availableTargets = getAvailableTargets(state);

  return {
    isBattleStarted: isBattleStarted(state),
    isTurnOwner: isPlayerTurnOwner(state),

    player,
    enemy,
    playerHand,
    enemyHand,
    playerMinions,
    enemyMinions,
    playerHero,
    enemyHero,
    availableTargets
  };
}

function noop() {}

export default connect(mapStateToProps, {
  onTurn,
  playCard,
  attack,
})(Battle as any);
