import {
  UNIT_SET_MOVES,
  UNIT_DECREASE_MOVES,
  UNIT_INCREASE_MOVES,
  UNIT_SET_HEALTH,
  UNIT_DECREASE_HEALTH,
  UNIT_INCREASE_HEALTH,
  UNIT_ADD_EFFECT,
  UNIT_ADD_COUNTER_EFFECTS,
} from "./index";

//
// ============ reducer ============
//

export default function unitReducer(state, { type, payload }) {
  switch (type) {
    case UNIT_INCREASE_HEALTH:
      return increase(state, payload, "health");
    case UNIT_SET_HEALTH:
      return update(state, payload, "health");
    case UNIT_DECREASE_HEALTH:
      return decrease(state, payload, "health");

    case UNIT_SET_MOVES:
      return update(state, payload, "moves");
    case UNIT_INCREASE_MOVES:
      return increase(state, payload, "moves");
    case UNIT_DECREASE_MOVES:
      return decrease(state, payload, "moves");

    case UNIT_ADD_EFFECT:
      return addEffectsToList(state, payload);
    case UNIT_ADD_COUNTER_EFFECTS:
      return addCounterEffectsToList(state, payload);

    default:
      return state;
  }
}

//
// ============ Actions ============
//


// === health ===

export function unitSetHealth(unitId, value) {
  return {
    type: UNIT_SET_HEALTH,
    payload: { unitId, value }
  };
}

export function unitDecreaseHealth(unitId, value) {
  return {
    type: UNIT_DECREASE_HEALTH,
    payload: { unitId, value }
  };
}

// === moves ===

export function unitSetMoves(unitId, value) {
  return {
    type: UNIT_SET_MOVES,
    payload: { value, unitId }
  };
}

export function unitIncreaseMoves(unitId, value) {
  return {
    type: UNIT_INCREASE_MOVES,
    payload: { value, unitId }
  };
}

export function unitDecreaseMoves(unitId, value) {
  return {
    type: UNIT_DECREASE_MOVES,
    payload: { value, unitId }
  };
}

// === effects & counterEffects ===

export function unitAddEffect(unitId, effect) {
  return {
    type: UNIT_ADD_EFFECT,
    payload: { unitId, value: effect }
  };
}

export function unitAddCounterEffects(unitId, effects) {
  return {
    type: UNIT_ADD_COUNTER_EFFECTS,
    payload: { unitId, value: effects }
  };
}

//
// ========= helpers =========
//

function increase(state, payload, field) {
  if (payload.unitId !== state._id) return state;
  return { ...state, [field]: [field] + payload.value };
}

function decrease(state, payload, field) {
  if (payload.unitId !== state._id) return state;
  return { ...state, [field]: state[field] - payload.value };
}

function update(state, payload, field) {
  if (payload.unitId !== state._id) return state;
  return { ...state, [field]: payload.value };
}

function addEffectsToList(state, payload) {
  if (payload.unitId !== state._id) return state;
  payload.value.ownerId = payload.unitId;
  return { ...state, effect: [...state.effect, ...payload.value] };
}

function addCounterEffectsToList(state, payload) {
  if (payload.unitId !== state._id) return state;
  return { ...state, counterEffects: [...state.counterEffects, ...payload.value] };
}
