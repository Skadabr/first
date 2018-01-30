import deepClone from "deep-copy";

import IO from "../socket";
import { USER_LOGOUT } from "./user.state";
import gamerReducer, { createGamerUpdate } from "./gamer.state";

export const START_FIGHT = "START_FIGHT";
export const END_OF_FIGHT = "END_OF_FIGHT";
export const GAMER_UPDATE = "GAMER_UPDATE";
export const TURN = "TURN";
export const ACQUIRE_TURN = "ACQUIRE_TURN";

export const EMPTY = {};
export const ME = "ME";
export const OPPONENT = "OPPONENT";
export const POSITIONS = 13;

const MIDDLE_POSITION = 6;
const SHIFT_CONSTANT = 7;

//
// ============ Reducer ============
//

export default function GameReducer(state = EMPTY, { type, payload }) {
  switch (type) {
    case START_FIGHT:
      return { ...payload, show_chat: true };

    case GAMER_UPDATE: {
      const { who, data } = payload;
      const gamer = gamerReducer(state[who], createGamerUpdate(data));
      return { ...state, [who]: gamer };
    }

    case TURN: {
      const me = gamerReducer( state[ME], createGamerUpdate(payload.me));
      return { ...state, [ME]: me, [OPPONENT]: payload.opponent, turn: false };
    }

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
    payload[ME].health = 10;
    payload[OPPONENT].warriors = [];
    payload[OPPONENT].health = 10;
    dispatch({ type: START_FIGHT, payload });
  };
}

export function addWarrior(me, warrior) {
  return dispatch => {
    let { warriors, last_warrior } = me;

    if (warriors.length > 5) return;
    //throw Error("too much warriors on the battle field");

    if (warriors.length === 0) {
      warrior.position = MIDDLE_POSITION;
      return dispatch({
        type: GAMER_UPDATE,
        payload: {
          who: ME,
          data: { last_warrior: warrior, warriors: [warrior] }
        }
      });
    }

    if (last_warrior) {
      warriors = [...warriors];
      warrior.position = warriors[warriors.length - 1].position;
      warriors[warriors.length - 1] = warrior;
      return dispatch({
        type: GAMER_UPDATE,
        payload: { who: ME, data: { warriors, last_warrior: warrior } }
      });
    }

    warrior.position = warriors[warriors.length - 1].position + 1;
    warriors = warriors.map(w => ({ ...w, position: w.position - 1 }));
    warriors.push(warrior);

    dispatch({
      type: GAMER_UPDATE,
      payload: { who: ME, data: { warriors, last_warrior: warrior } }
    });
  };
}

export function toTurn(me, opponent) {
  return dispatch => {
    me = deepClone(me);
    opponent = deepClone(opponent);

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
          if (ops.length === 0) {
            opponent.health -= damage;
            return;
          }
          ops.forEach(op => {
            op.health -= damage;
          });
        }
      });
    }

    if (opponent.health < 1) {
      return IO().gameIO.finishFight();
    }

    opponent.warriors = adjustPositions(opponent.warriors);
    const money = me.money - (me.last_warrior ? me.last_warrior.price : 0);

    IO().gameIO.toTurn({ ...me, money }, opponent);
    dispatch({
      type: TURN,
      payload: { me: { money, last_warrior: null }, opponent }
    });
  };
}

export function acquireTurn(me, opponent) {
  return dispatch => {
    dispatch({ type: ACQUIRE_TURN, payload: { me, opponent } });
  };
}

export function endOfFight(payload) {
  return dispatch => {
    dispatch({ type: END_OF_FIGHT, payload});
  };
}

//
// ============ helpers ============
//

function adjustPositions(warriors) {
  warriors = warriors.filter(op => op.health > 0);
  let shift = SHIFT_CONSTANT - warriors.length;
  for (const w of warriors) {
    w.position = shift;
    shift += 2;
  }
  return warriors;
}
