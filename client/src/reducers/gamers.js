const HEALTH = 10;
const EMPTY = {};

export default function gamerReducer(state = {}, { type, payload }) {
  const { name } = payload;
  const gamer = state[name];

  switch (type) {
    case GAMER_ADD: {
      return { ...state, [name]: { health: HEALTH } };
    }

    case GAMER_RELEASE: {
      return { ...state, [name]: EMPTY };
    }

    case GAMER_KICKED: {
      return { ...state, [name]: { health: state.health - payload } };
    }
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
    type: GAMER_UPDATE,
    payload: { name, damage }
  };
}

export function gamerRelease(name) {
  return {
    type: GAMER_RELEASE,
    payload: { name }
  };
}
