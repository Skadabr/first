import deepClone from "deep-copy";

import IO from "../socket";
import { USER_LOGOUT } from "./user.state";
import gamerReducer, { createGamerUpdate } from "./gamer.state";

export const START_FIGHT = "START_FIGHT";
export const END_OF_FIGHT = "END_OF_FIGHT";
export const ADD_WARRIOR = "ADD_WARRIOR";
export const GAME_UPDATE = "GAME_UPDATE";
export const ACQUIRE_TURN = "ACQUIRE_TURN";

export const EMPTY = {};
export const ME = "ME";
export const OPPONENT = "OPPONENT";
export const TURN = "TURN";

//
// ============ Reducer ============
//

export default function GameReducer(state = EMPTY, { type, payload }) {
  switch (type) {
    case START_FIGHT:
      return { ...payload, show_chat: true };

    case ADD_WARRIOR:
      const { who, warriors, last_warrior } = payload;
      const gamer = gamerReducer(
        state[who],
        createGamerUpdate({ warriors, last_warrior })
      );
      return { ...state, [who]: gamer };

    case TURN:
      const me = gamerReducer(
        state[ME],
        createGamerUpdate({ last_warrior: null })
      );
      return { ...state, [ME]: me, [OPPONENT]: payload, turn: false };

    case ACQUIRE_TURN: {
      let { me, opponent } = payload;
      return {
        ...state,
        [ME]: gamerReducer(state[ME], createGamerUpdate(me)),
        [OPPONENT]: gamerReducer(state[OPPONENT], createGamerUpdate(opponent)),
        turn: true
      };
    }

    case END_OF_FIGHT:
    case USER_LOGOUT:
      return EMPTY;

    default:
      return state;
  }
}

//
// ============ Actions ============
//

export function startFight(payload) {
  return dispatch => {
    payload[ME].warriors = [];
    payload[ME].health = 30;
    payload[OPPONENT].warriors = [];
    payload[OPPONENT].health = 30;
    dispatch({ type: START_FIGHT, payload });
  };
}

export function addWarrior(who, game, warrior) {
  return dispatch => {
    let warriors = game[who].warriors;
    let last_warrior = game[who].last_warrior;

    if (warriors.length > 5) return;
    //throw Error("too much warriors on the battle field");

    if (warriors.length === 0) {
      warrior.position = 4;
      return dispatch({
        type: ADD_WARRIOR,
        payload: { who, last_warrior: warrior, warriors: [warrior] }
      });
    }

    if (last_warrior) {
      warriors = [...warriors];
      warrior.position = warriors[warriors.length - 1].position;
      warriors[warriors.length - 1] = warrior;
      return dispatch({
        type: ADD_WARRIOR,
        payload: { who, warriors, last_warrior: warrior }
      });
    }

    warrior.position = warriors[warriors.length - 1].position + 1;
    warriors = warriors.map(w => ({ ...w, position: w.position - 1 }));
    warriors.push(warrior);

    dispatch({
      type: ADD_WARRIOR,
      payload: { who, warriors, last_warrior: warrior }
    });
  };
}

export function toTurn(game) {
  return dispatch => {
    const me = deepClone(game[ME]);
    const opponent = deepClone(game[OPPONENT]);

    if (opponent.warriors.length === 0) {
      me.warriors.forEach(({ damage }) => {
        opponent.health -= damage;
      });
    } else {
      me.warriors.forEach(({ position, damage }) => {
        const op = opponent.warriors.find(op => op.position === position);
        if (op) {
          op.health -= damage;
        } else {
          const ops = opponent.warriors.filter(
            op => op.position === position - 1 || op.position === position + 1
          );
          ops.forEach(op => {
            op.health -= damage;
          });
        }
      });
    }

    IO().gameIO.toTurn(me, opponent);
    dispatch({ type: TURN, payload: opponent });
  };
}

export function acquireTurn(me, opponent) {
  return dispatch => {
    dispatch({ type: ACQUIRE_TURN, payload: { me, opponent } });
  };
}

export function endOfFight() {
  return dispatch => {
    dispatch({ type: END_OF_FIGHT });
  };
}

//
// ============ Action creators ============
//
