export const GAMER_UPDATE = "GAMER_UPDATE";

//
// ============ Reducer ============
//

export default function(state = {}, { type, payload }) {
  switch (type) {
    case GAMER_UPDATE:
      return { ...state, ...payload };

    default:
      return state;
  }
}

//
// ============ Action creators ============
//

export function createGamerUpdate(payload) {
  return {
    type: GAMER_UPDATE,
    payload
  }

}
