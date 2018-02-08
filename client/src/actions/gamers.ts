import { CLEAN_STATE } from "../constants";

const GAMER_ADD = "GAMER_ADD";
const GAMER_RELEASE = "GAMER_RELEASE";
const GAMER_KICKED = "GAMER_KICKED";
const GAMER_UPDATE = "GAMER_UPDATE";

const HEALTH = 10;
const MONEY = 1;
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
) {
  const gamer = state[name];

  switch (type) {
    case GAMER_ADD: {
      return { ...state, [name]: { name, health: HEALTH, money: MONEY } };
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

//  case GAMER_INCREASE_MONEY:
//    return { ...state, [name]: { ...gamer, money: gamer.money + 1 } };

    case CLEAN_STATE:
      return EMPTY;

    default:
      return state;
  }
}

//
// ============ Actions ============
//

export function gamerAdd(name) {
  return {
    type: GAMER_ADD,
    name,
    payload: { name }
  };
}

export function gamerKicked(name, damage) {
  return {
    type: GAMER_KICKED,
    name,
    payload: { damage }
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
