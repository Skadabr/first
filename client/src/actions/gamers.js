import { CLEAN_STATE } from "../constants";

const GAMER_ADD = "GAMER_ADD";
const GAMER_RELEASE = "GAMER_RELEASE";
const GAMER_KICKED = "GAMER_KICKED";
const GAMER_SET_HEALTH = "GAMER_SET_HEALTH";
const GAMER_INCREASE_MONEY = "GAMER_INCREASE_MONEY";

const HEALTH = 10;
const MONEY = 1;
const EMPTY = {};

export default function gamersReducer(state = {}, { type, payload }) {
  const name = payload && payload.name;
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

    case GAMER_SET_HEALTH:
      return { ...state, [name]: { ...gamer, health: payload.health } };

    case GAMER_INCREASE_MONEY:
      return { ...state, [name]: { ...gamer, money: gamer.money + 1 } };

    case CLEAN_STATE:
      return {};

    default:
      return state;
  }
}

export function gamerAdd(name) {
  return {
    type: GAMER_ADD,
    payload: { name }
  };
}

export function gamerKicked(name, damage) {
  return {
    type: GAMER_KICKED,
    payload: { name, damage }
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
    type: GAMER_SET_HEALTH,
    payload: { name, health }
  };
}

export function gamerIncreaseMoney(name) {
  return {
    type: GAMER_INCREASE_MONEY,
    payload: { name }
  };
}
