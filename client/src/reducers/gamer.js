const HEALTH = 10;
const EMPTY = {}

export default function gamerReducer(state = {}, { type, payload }) {
  if (!state.name || state.name !== payload.name) {
    return state;
  }

  switch (type) {
    case GAMER_ADD: {
      return { health: HEALTH, name: payload };
    }

    case GAMER_RELEASE: {
      return EMPTY;
    }

    case GAMER_KICKED: {
      return { ...state, health: state.health - payload };
    }
  }
}

export function gamerAdd(name) {
  return {
    type: GAMER_UPDATE,
    payload: name
  };
}

export function gamerKicked(damage) {
  return {
    type: GAMER_UPDATE,
    payload: damage
  };
}
