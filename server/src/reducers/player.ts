export default function playerReducer(state, action) {
  switch (action.type) {
    case ADD_UNIT:
      const units = [...state.units, action.payload.unit];
      return { ...state, units };

    case REMOVE_UNIT:
      const units = state.units.filter(u => u.id !== action.payload.id);
      return { ...state, units };

    default:
      return {
        units: unitsReducer(state.units, action),
        hero: heroReducer(state.hero, action),
        user: userReducer(state.user, action),
        money: state.money,
        pocket_size: state.pocket_size
      };
  }
}
