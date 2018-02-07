import { CLEAN_STATE } from "../constants";

const GAME_UPDATE = "GAME_UPDATE";

const EMPTY = {
  active: false
};

export default function gameReducer(state = EMPTY, { type, payload }) {
  switch (type) {
    case GAME_UPDATE: {
      return { ...state, ...payload };
    }
    case CLEAN_STATE:
      return EMPTY;
    default:
      return state;
  }
}

export function gameInit(my_name, opponent_name, turn) {
  return {
    type: GAME_UPDATE,
    payload: { my_name, opponent_name, turn, active: true }
  };
}

export function gameTurnOn() {
  return {
    type: GAME_UPDATE,
    payload: { turn: true }
  };
}

export function gameTurnOff() {
  return {
    type: GAME_UPDATE,
    payload: { turn: false }
  };
}

export function gameActive() {
  return {
    type: GAME_UPDATE,
    payload: { active: true }
  };
}

export function gameInActive() {
  return {
    type: GAME_UPDATE,
    payload: { active: false }
  };
}
