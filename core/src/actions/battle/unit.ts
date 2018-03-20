import {
  UNIT_ACTIVATE,
  UNIT_DISACTIVATE,
  UNIT_SET_AVAILABILITY,
  UNIT_DECREASE_AVAILABILITY,
  UNIT_INCREASE_AVAILABILITY,
  UNIT_SET_MOVES,
  UNIT_DECREASE_MOVES,
  UNIT_INCREASE_MOVES,
  UNIT_DECREASE_HEALTH,
  UNIT_INCREASE_HEALTH
} from "./index";

//
// ============ reducer ============
//

export default function unitReducer(state, { type, payload }) {
  switch (type) {
    case UNIT_INCREASE_HEALTH:
      return increase(state, payload, "health");
    case UNIT_DECREASE_HEALTH:
      return decrease(state, payload, "health");

    case UNIT_ACTIVATE:
      return update(state, {...payload, active: true},'active');
    case UNIT_DISACTIVATE:
      return update(state, {...payload, active: false},'active');

    case UNIT_SET_AVAILABILITY:
      return update(state, payload, "availability");
    case UNIT_INCREASE_AVAILABILITY:
      return increase(state, payload, "availability");
    case UNIT_DECREASE_AVAILABILITY:
      return decrease(state, payload, "availability");

    case UNIT_SET_MOVES:
      return update(state, payload, "moves");
    case UNIT_INCREASE_MOVES:
      return increase(state, payload, "moves");
    case UNIT_DECREASE_MOVES:
      return decrease(state, payload, "moves");

    default:
      return state;
  }
}

//
// ============ Actions ============
//

export function unitActivate(unit_id) {
  return {
    type: UNIT_ACTIVATE,
    payload: { unit_id }
  };
}

export function unitDisActivate(unit_id) {
  return {
    type: UNIT_DISACTIVATE,
    payload: { unit_id }
  };
}

export function unitDecreaseHealth(target_id, amount) {
  return {
    type: UNIT_DECREASE_HEALTH,
    payload: { target_id, amount }
  };
}

export function unitDecreaseAvailability(unit_id, amount) {
  return {
    type: UNIT_DECREASE_AVAILABILITY,
    payload: { amount, unit_id }
  };
}

export function unitDecreaseMoves(unit_id, amount) {
  return {
    type: UNIT_DECREASE_MOVES,
    payload: { amount, unit_id }
  };
}

export function unitIncreaseMoves(unit_id, amount) {
  return {
    type: UNIT_INCREASE_MOVES,
    payload: { amount, unit_id }
  };
}

export function unitSetMoves(unit_id, moves) {
  return {
    type: UNIT_SET_MOVES,
    payload: { moves, unit_id }
  };
}

export function unitSetAvailability(unit_id, availability) {
  return {
    type: UNIT_SET_AVAILABILITY,
    payload: { availability, unit_id }
  };
}

//
// ========= helpers =========
//

function increase(state, payload, field) {
  const { amount, unit_id } = payload;
  if (unit_id !== state._id) return state;
  return { ...state, [field]: [field] + amount };
}

function decrease(state, payload, field) {
  const { amount, unit_id } = payload;
  if (unit_id !== state._id) return state;
  return { ...state, [field]: state[field] - amount };
}

function update(state, payload, field) {
  if (payload.unit_id !== state._id) return state;
  return { ...state, [field]: payload[field] };
}
