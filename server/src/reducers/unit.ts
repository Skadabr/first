export default function unitReducer(state, { type, payload }) {
  switch (type) {
    case ATTACK:
      if (payload.target.id !== state.id) return state;

      return { ...state, health: state.health - payload.unit.damage };

    default:
      return state;
  }
}
