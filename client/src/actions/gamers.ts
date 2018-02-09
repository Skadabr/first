import { CLEAN_STATE } from "../constants";

const GAMER_ADD = "GAMER_ADD";
const GAMER_RELEASE = "GAMER_RELEASE";
const GAMER_KICKED = "GAMER_KICKED";
const GAMER_UPDATE = "GAMER_UPDATE";

const EMPTY = {};

//
// ============ Reducer ============
//

export interface GamersState {
  [s: string]: {
    name: string;
    health: number;
    money: number;
  };
}

export default function gamersReducer(
  state: GamersState = EMPTY,
  { type, name, payload }
) : GamersState {
  const gamer = state[name];

  switch (type) {
    case GAMER_ADD: {
      const {health, money} = payload
      return { ...state, [name]: { name, money, health } };
    }

    case GAMER_RELEASE: {
      return { ...state, [name]: EMPTY };
    }

    case GAMER_KICKED: {
      return {
        ...state,
        [name]: { ...gamer, health: gamer.health - payload.damage }
      };
    }

    case GAMER_UPDATE:
      return { ...state, [name]: { ...gamer, ...payload } };

    case CLEAN_STATE:
      return EMPTY;

    default:
      return state;
  }
}

//
// ============ Actions ============
//

export function gamerAdd({name, gamer}) {
  return {
    type: GAMER_ADD,
    name,
    payload: gamer
  };
}

export function gamerRelease(name) {
  return {
    type: GAMER_RELEASE,
    payload: { name }
  };
}

export function gamerSetHealth(name, health) {
  return {
    type: GAMER_UPDATE,
    name,
    payload: { health }
  };
}

export function gamerSetMoney(name, money) {
  return {
    type: GAMER_UPDATE,
    name,
    payload: { money }
  };
}

export function gamerKicked(name, damage) {
  return {
    type: GAMER_KICKED,
    name,
    payload: { damage }
  };
}

