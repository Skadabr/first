import { CLEAN_STATE} from "../constants";

const GAMER_ADD = "GAMER_ADD";
const GAMER_RELEASE = "GAMER_RELEASE";
const GAMER_KICKED = "GAMER_KICKED";

const HEALTH = 10;
const EMPTY = {};

export default function gamersReducer(state = {}, { type, payload }) {
  const name = payload && payload.name;
  const gamer = state[name];

  switch (type) {
    case GAMER_ADD: {
      return { ...state, [name]: { name, health: HEALTH } };
    }

    case GAMER_RELEASE: {
      return { ...state, [name]: EMPTY };
    }

    case GAMER_KICKED: {
      return { ...state, [name]: { health: state.health - payload.damage } };
    }

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
