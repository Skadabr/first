import unitReducer, {unitDecreaseAvailability} from "./unit";

const EMPTY = {};

//
// ============ reducer ============
//

export default function unitsReducer(state, action) {
  switch (action.type) {

    default:
      return state.map(unit => unitReducer(unit, action));
  }
}

//
// ============ Actions ============
//

