import deepClone from "deep-copy";

import { USER_LOGOUT } from "./user.state";

export const START_FIGHT = "START_FIGHT";
export const END_OF_FIGHT = "END_OF_FIGHT";
export const ADD_WARRIOR = "ADD_WARRIOR";

export const EMPTY = {};
export const ME = "ME";
export const OPPONENT = "OPPONENT";

//
// ============ Reducer ============
//

export default function(state = EMPTY, { type, payload }) {
  switch (type) {
    case START_FIGHT:
      return { ...payload, show_chat: true };

    case ADD_WARRIOR:
      const { who, warriors, last_warrior } = payload;
      const gamer = { ...state[who], warriors, last_warrior };
      return { ...state, [who]: gamer };

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
  const myWarriors = deepClone(game[ME]);
  const opponentWarriors = deepClone(game[OPPONENT]);

  if (opponentWarriors.length === 0) {
    myWarriors.forEach(({damage}) => {

    })
  }

  myWarriors.forEach(({ position, damage }) => {
    const op = opponentWarriors.find(op => op.position === position);
    if (op) {
      op.health -= damage;
    } else {
    }
  });
}

export function endOfFight() {
  return dispatch => {
    dispatch({ type: END_OF_FIGHT });
  };
}

//
// ============ Action creators ============
//
