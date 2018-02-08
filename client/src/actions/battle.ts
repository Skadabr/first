import IO from "../socket";
import { gamerKicked, gamerRelease, gamerAdd, gamerSetHealth } from "./gamers";
import { warriorKicked, warriorsRelease } from "./warriors";
import { gameTurnOn, gameTurnOff, gameInit, gameInActive } from "./game";
import { warriorsInit, warriorsSet, Warrior } from "./warriors";
import { gameChatAddMessage } from "./game_chat";
import { userIncreaseRate, userDecreaseRate, userUpdateStatus } from "./user";
import { StatusKinds, WarriorKinds } from "../constants";

export function startFight({ turn, me, opponent }) {
  return dispatch => {
    dispatch(userUpdateStatus(StatusKinds.FIGHT));
    dispatch(gamerAdd(me.name));
    dispatch(gamerAdd(opponent.name));
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
    io.addWarrior(kind, position);
  };
}

export function updateWarriors(data: {
  owner_name: string;
  warriors: Warrior[];
  money: number;
}) {
  return dispatch => {
    const { warriors, money, owner_name } = data;
    warriorsSet(owner_name, warriors);
  };
}

export function oneSideKickOtherSide(warriors, opponent, opponent_warriors) {
  return dispatch => {
    warriors.forEach(warrior => {
      kickOpponents(warrior, opponent, opponent_warriors)(dispatch);
    });
  };
}

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
