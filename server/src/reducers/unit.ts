const UNIT_ATTACK = "UNIT_ATTACK";

export default function unitReducer(state, { type, payload }) {
  switch (type) {
    case UNIT_ATTACK:
      if (payload.target.id !== state.id) return state;

      return { ...state, health: state.health - payload.unit.damage };

    default:
      return state;
  }
}
