import playersReducer from "./players";

const EMPTY = {};

export const BATTLE_UPDATE = "BATTLE_UPDATE";
export const BATTLE_NEXT_TURN = "BATTLE_NEXT_TURN";

export const PLAYER_ADD_UNIT = "PLAYER_ADD_UNIT";
export const PLAYER_REMOVE_UNIT = "PLAYER_REMOVE_UNIT";
export const PLAYER_ADD_CARDS = "PLAYER_ADD_CARDS";
export const PLAYER_REMOVE_CARD = "PLAYER_REMOVE_CARD";
export const PLAYER_DECREASE_MONEY = "PLAYER_DECREASE_MONEY";
export const PLAYER_ADJUST_MONEY = "PLAYER_ADJUST_MONEY";

export const UNIT_ACTIVATE = "UNIT_ACTIVATE";
export const UNIT_DISACTIVATE = "UNIT_DISACTIVATE";
export const UNIT_DECREASE_AVAILABILITY = "UNIT_DECREASE_AVAILABILITY";
export const UNIT_INCREASE_AVAILABILITY = "UNIT_INCREASE_AVAILABILITY";
export const UNIT_SET_AVAILABILITY = "UNIT_SET_AVAILABILITY";
export const UNIT_SET_MOVES = "UNIT_SET_MOVES";
export const UNIT_DECREASE_MOVES = "UNIT_DECREASE_MOVES";
export const UNIT_INCREASE_MOVES = "UNIT_INCREASE_MOVES";

export const UNITS_REMOVE = "UNITS_REMOVE";

export const ATTACK = "ATTACK";

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
      const curTurnOwnerId = state.turnOwner;
      const nextPlayer = state.players.find(p => p.user._id !== curTurnOwnerId);
      return {
        ...state,
        turnOwner: nextPlayer.user._id
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
