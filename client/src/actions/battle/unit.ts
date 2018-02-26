const UNIT_ATTACK = "UNIT_ATTACK";
const UNIT_ACTIVATE = "UNIT_ACTIVATE";
const UNIT_NOT_ACTIVATE = "UNIT_NOT_ACTIVATE";
const UNIT_AVAILABLE = "UNIT_AVAILABLE";
const UNIT_NOT_AVAILABLE = "UNIT_NOT_AVAILABLE";

//
// ============ reducer ============
//

export default function unitReducer(state, { type, payload }) {
  switch (type) {
    case UNIT_ATTACK: {
      const { target, damage } = payload;
      if (target._id !== state._id) return state;

      return { ...state, health: state.health - damage };
    }

    case UNIT_ACTIVATE:
      if (payload.unit._id !== state._id) return state;
      return { ...state, active: true };

    case UNIT_NOT_ACTIVATE:
      if (payload.unit._id !== state._id) return state;
      return { ...state, active: false };

    case UNIT_AVAILABLE: {
      if (payload.unit._id !== state._id) return state;
      return { ...state, available: true };
    }

    case UNIT_NOT_AVAILABLE: {
      if (payload.unit._id !== state._id) return state;
      return { ...state, available: false };
    }

    default:
      return state;
  }
}

//
// ============ Actions ============
//

export function unitActivate(unit) {
  return {
    type: UNIT_ACTIVATE,
    payload: { unit }
  };
}

export function unitNotActivate(unit) {
  return {
    type: UNIT_NOT_ACTIVATE,
    payload: { unit }
  };
}

export function unitAvailable(unit: { unit: { _id: string } }) {
  return {
    type: UNIT_AVAILABLE,
    payload: { unit }
  };
}

export function unitNotAvailable(unit) {
  return {
    type: UNIT_NOT_AVAILABLE,
    payload: { unit }
  };
}

export function unitAttack(payload, effects: any[]) {
  return {
    type: UNIT_ATTACK,
    effects,
    payload
  };
}
