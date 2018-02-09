import IO from "../socket";
import {
  gamerRelease,
  gamerAdd,
  gamerSetHealth,
  gamerSetMoney
} from "./gamers";
import { warriorKicked, warriorsRelease, WarriorsState } from "./warriors";
import { gameTurnOn, gameTurnOff, gameInit, gameInActive } from "./game";
import { warriorsInit, warriorsSet, Warrior } from "./warriors";
import { gameChatAddMessage } from "./game_chat";
import { userIncreaseRate, userDecreaseRate, userUpdateStatus } from "./user";
import { StatusKinds, WarriorKinds } from "../constants";

export function startFight({ turn, me, opponent }) {
  return dispatch => {
    dispatch(userUpdateStatus(StatusKinds.FIGHT));
    dispatch(gamerAdd(me));
    dispatch(gamerAdd(opponent));
    dispatch(warriorsInit([me.name, opponent.name]));
    dispatch(gameInit(me.name, opponent.name, turn));
  };
}

export function sendMessage(msg, name) {
  return dispatch => {
    const date = new Date();
    IO().gameIO.sendMessage(msg, name, date);
    dispatch(gameChatAddMessage(msg, name, date));
  };
}

export function addWarrior(kind: WarriorKinds, position: number) {
  return dispatch => {
    const io = IO().gameIO;
    io.addWarrior(kind, position, val => {
      if (!val) {
        alert(
          "Either money is not enough or you try put your warrior on top of another"
        );
        return;
      }
      updateWarriors(val)(dispatch);
    });
  };
}

export function updateWarriors(data) {
  return dispatch => {
    const { warriors, money, owner_name } = data;
    dispatch(warriorsSet(owner_name, warriors));
    dispatch(gamerSetMoney(owner_name, money));
  };
}

export function onTurn(my_warriors: WarriorsState) {
  return async dispath => {
    const io = IO().gameIO;

    for (const w of my_warriors) {
      await new Promise((resolve, reject) => io.kickOpponent(w.kind, resolve));
    }
  }
}

//export function oneSideKickOtherSide(warriors, opponent, opponent_warriors) {
//  return dispatch => {
//    warriors.forEach(warrior => {
//      kickOpponents(warrior, opponent, opponent_warriors)(dispatch);
//    });
//  };
//}

export function kickOpponents(warrior, opponent, opponent_warriors) {
  return dispatch => {
    console.debug("kickOpponents", warrior, opponent, opponent_warriors);
    if (opponent_warriors.length === 0) {
      return dispatch(gamerKicked(opponent.name, warrior.damage));
    }

    const { position, damage } = warrior;
    const w = opponent_warriors.find(w => w.position === position);

    if (w) return dispatch(warriorKicked(opponent.name, w.id, damage));

    const ws = opponent_warriors.filter(
      w => w.position === position - 1 || w.position === position + 1
    );

    if (ws.length === 0) dispatch(gamerKicked(opponent.name, warrior.damage));
    else
      for (const w of ws) dispatch(warriorKicked(opponent.name, w.id, damage));
  };
}

export function passTheTurn(me, opponent) {
  return dispatch => {
    const io = IO().gameIO;

    if (opponent.health < 1) {
      io.winFight();
      cleanGameState(me.name, opponent.name)(dispatch);
      dispatch(userIncreaseRate());
      return;
    }

    io.passTheTurn({
      opponent: {
        health: opponent.health,
        warriors: opponent.warriors,
        name: opponent.name
      },
      me: {
        warriors: me.warriors,
        name: me.name
      }
    });
    dispatch(gameTurnOff());
  };
}

export function acquireTurn({ me, opponent }) {
  return dispatch => {
    dispatch(warriorsSet(me.name, me.warriors));
    dispatch(warriorsSet(opponent.name, opponent.warriors));
    dispatch(gamerSetHealth(me.name, me.health));
    dispatch(gameTurnOn());
  };
}

export function looseTheGame(myName, opponentName) {
  return dispatch => {
    cleanGameState(myName, opponentName)(dispatch);
    dispatch(userDecreaseRate());
  };
}

function cleanGameState(myName, opponentName) {
  return dispatch => {
    dispatch(gamerRelease(myName));
    dispatch(gamerRelease(opponentName));
    dispatch(warriorsRelease(myName));
    dispatch(warriorsRelease(opponentName));
    dispatch(gameInActive());
  };
}
