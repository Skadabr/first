import {
  UNIT_ACTIVATE,
  UNIT_DISACTIVATE,
  UNIT_SET_AVAILABILITY,
  UNIT_DECREASE_AVAILABILITY,
  UNIT_INCREASE_AVAILABILITY,
  UNIT_SET_MOVES,
  UNIT_DECREASE_MOVES,
  UNIT_INCREASE_MOVES,
  ATTACK
} from ".";

//
// ============ reducer ============
//

export default function unitReducer(state, { type, payload }) {
  switch (type) {
    case ATTACK: {
      const { target_id, damage } = payload;
      if (target_id !== state._id) return state;

      return { ...state, health: state.health - damage };
    }

    case UNIT_ACTIVATE: {
      const { unit_id } = payload;
      if (unit_id !== state._id) return state;
      return { ...state, active: true };
    }

    case UNIT_DISACTIVATE: {
      const { unit_id } = payload;
      if (unit_id !== state._id) return state;
      return { ...state, active: false };
    }

    case UNIT_SET_AVAILABILITY: {
      const { availability, unit_id } = payload;
      if (unit_id !== state._id) return state;
      return { ...state, availability };
    }

    case UNIT_INCREASE_AVAILABILITY: {
      const { amount, unit_id } = payload;
      if (unit_id !== state._id) return state;
      return { ...state, availability: state.availability + amount };
    }

    case UNIT_DECREASE_AVAILABILITY: {
      const { amount, unit_id } = payload;
      if (unit_id !== state._id) return state;
      return { ...state, availability: state.availability - amount };
    }

    case UNIT_SET_MOVES: {
      const { moves, unit_id } = payload;
      if (unit_id !== state._id) return state;
      return { ...state, moves };
    }

    case UNIT_INCREASE_MOVES: {
      const { amount, unit_id } = payload;
      if (unit_id !== state._id) return state;
      return { ...state, moves: state.moves + amount };
    }

    case UNIT_DECREASE_MOVES: {
      const { amount, unit_id } = payload;
      if (unit_id !== state._id) return state;
      return { ...state, moves: state.moves - amount };
    }

    default:
      return state;
  }
}

//
// ============ Actions ============
//

export function unitActivate(unit_id, effects) {
  return {
    type: UNIT_ACTIVATE,
    effects,
    payload: { unit_id }
  };
}

export function unitDisActivate(unit_id, effects) {
  return {
    type: UNIT_DISACTIVATE,
    effects,
    payload: { unit_id }
  };
}

export function unitAttack(unit_id, target_id, damage, effects: any[]) {
  return {
    type: ATTACK,
    effects,
    payload: { unit_id, target_id, damage }
  };
}

export function unitDecreaseAvailability(amount, unit_id) {
  return {
    type: UNIT_DECREASE_AVAILABILITY,
    payload: { amount, unit_id }
  };
}

export function unitIncreaseAvailability(amount, unit_id) {
  return {
    type: UNIT_INCREASE_AVAILABILITY,
    payload: { amount, unit_id }
  };
}

export function unitDecreaseMoves(amount, unit_id) {
  return {
    type: UNIT_DECREASE_MOVES,
    payload: { amount, unit_id }
  };
}

export function unitIncreaseMoves(amount, unit_id) {
  return {
    type: UNIT_INCREASE_MOVES,
    payload: { amount, unit_id }
  };
}

export function unitSetMoves(moves, unit_id) {
  return {
    type: UNIT_SET_MOVES,
    payload: { moves, unit_id }
  };
}

export function unitSetAvailability(availability, unit_id) {
  return {
    type: UNIT_SET_AVAILABILITY,
    payload: { availability, unit_id }
  };
}
