export const START_FIGHT = "START_FIGHT";
export const EMPTY = {};

//
// ============ Reducer ============
//

export default function(state = EMPTY, { type, payload }) {
  switch (type) {
    case START_FIGHT:
      return payload;

    default:
      return state;
  }
}

//
// ============ Actions ============
//

export function startFight(payload) {
  return dispatch => {
    dispatch({ type: START_FIGHT, payload });
  };
}

//
// ============ Action creators ============
//
