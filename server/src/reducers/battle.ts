import playersReducer from "./players";
import { nextTurnOwnerSelector } from "../selectors";

const TURN = "TURN";

export default function battleReducer(state, action) {
  switch (action.type) {
    case BATTLEFIELD_UPDATE:
      return payload;

    case TURN:
      return {
        turn_owner: nextTurnOwnerSelector(state),
        players: state.players
      };

    default:
      return {
        ...state,
        players: playersReducer(state.players, action)
      };
  }
}
