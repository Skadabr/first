export default function battleReducer(state, action) {
  switch (action.type) {
    case TURN:
      return {
        turn_owner: nextTurnOwnerSelector(state, state.turn_owner),
        players: state.players
      };

    default:
      return {
        ...state,
        players: playersReducer(state.players, action)
      };
  }
}
