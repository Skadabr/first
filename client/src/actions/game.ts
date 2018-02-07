import { CLEAN_STATE } from "../constants";

const GAME_UPDATE = "GAME_UPDATE";

const EMPTY = {
  active: false
};

//
// ============ Reducer ============
//

export interface GameState {
  active: boolean;
  turn?: boolean;
  my_name?: string;
  opponent_name?: string;
}

export default function gameReducer(
  state: GameState = EMPTY,
  { type, payload }
) {
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

//
// ============ Actions ============
//

export function gameInit(
  my_name: string,
  opponent_name: string,
  turn: boolean
) {
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
