const EMPTY = {};

export default function battleFieldReducer(state = EMPTY, {type, payload}) : BattleState | Object {
  switch(type) {
    case BATTLEFIELD_UPDATE:
      return payload;
    default:
      return state;
  }
}
