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
  UNIT_INCREASE_HEALTH,
  UNIT_ADD_EFFECT
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
      return update(state, { ...payload, active: true }, "active");
    case UNIT_DISACTIVATE:
      return update(state, { ...payload, active: false }, "active");

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

    case UNIT_ADD_EFFECT:
      return add(state, payload, 'effects');

    default:
      return state;
  }
}

//
// ============ Actions ============
//

export function unitActivate(unitId) {
  return {
    type: UNIT_ACTIVATE,
    payload: { unitId }
  };
}

export function unitDisActivate(unitId) {
  return {
    type: UNIT_DISACTIVATE,
    payload: { unitId }
  };
}

export function unitDecreaseHealth(targetId, value) {
  return {
    type: UNIT_DECREASE_HEALTH,
    payload: { targetId, value }
  };
}

export function unitDecreaseAvailability(unitId, value) {
  return {
    type: UNIT_DECREASE_AVAILABILITY,
    payload: { value, unitId }
  };
}

export function unitDecreaseMoves(unitId, value) {
  return {
    type: UNIT_DECREASE_MOVES,
    payload: { value, unitId }
  };
}

export function unitIncreaseMoves(unitId, value) {
  return {
    type: UNIT_INCREASE_MOVES,
    payload: { value, unitId }
  };
}

export function unitSetMoves(unitId, moves) {
  return {
    type: UNIT_SET_MOVES,
    payload: { moves, unitId }
  };
}

export function unitSetAvailability(unitId, availability) {
  return {
    type: UNIT_SET_AVAILABILITY,
    payload: { availability, unitId }
  };
}

export function unitAddEffect(unitId, effect) {
  return {
    type: UNIT_ADD_EFFECT,
    payload: { unitId, effect }
  };
}

//
// ========= helpers =========
//

function increase(state, payload, field) {
  const { value, unitId } = payload;
  if (unitId !== state._id) return state;
  return { ...state, [field]: [field] + value };
}

function decrease(state, payload, field) {
  const { value, unitId } = payload;
  if (unitId !== state._id) return state;
  return { ...state, [field]: state[field] - value };
}

function update(state, payload, field) {
  if (payload.unitId !== state._id) return state;
  return { ...state, [field]: payload[field] };
}

function add(state, payload, field) {
  if (payload.unitId !== state._id) return state;
  return { ...state, [field]: [...state[field], payload.value] };
}
