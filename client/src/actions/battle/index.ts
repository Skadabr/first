import playersReducer from "./players";

const EMPTY = {};

export const BATTLE_UPDATE = "BATTLE_UPDATE";
export const BATTLE_NEXT_TURN = "BATTLE_NEXT_TURN";


//
// ============ reducers ============
//

export interface BattleState {
  turnOwner: string;
  players: any[];
}

export default function battleReducer(state = EMPTY as any, action) {
  switch (action.type) {
    case BATTLE_UPDATE:
      return action.payload;

    case BATTLE_NEXT_TURN: {
      const curTurnOwner = state.turnOwner;
      const turnOwner = state.players
        .map(p => p.user._id)
        .find(id => curTurnOwner);
      return {
        ...state,
        turnOwner
      };
    }

    default:
      return {
        ...state,
        players: playersReducer(state.players, action)
      };
  }
}

//
// ============ Actions ============
//

export function battleUpdate(battle) {
  return {
    type: BATTLE_UPDATE,
    payload: battle
  };
}

export function battleNextTurn() {
  return {
    type: BATTLE_NEXT_TURN
  };
}
