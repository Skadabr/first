const UPDATE_AVAILABLE_TARGETS = "UPDATE_AVAILABLE_TARGETS";

const EMPTY = [];

//
// ============ reducer ============
//

export default function availableTargetsReducer(
  state = EMPTY,
  { type, payload }
) {
  switch (type) {
    case UPDATE_AVAILABLE_TARGETS:
      return payload;
    default:
      return state;
  }
}

//
// ============ Actions ============
//

export function availableTargetsUpdate(targets) {
  return {
    type: UPDATE_AVAILABLE_TARGETS,
    payload: targets
  };
}
