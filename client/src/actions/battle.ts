const EMPTY = {};

export const BATTLE_UPDATE = "BATTLE_UPDATE";

export default function battleReducer(state = EMPTY as any, action) {
  switch (action.type) {
    case BATTLE_UPDATE:
      return action.payload;

    default:
      return state;
  }
}

export function battleUpdate(battle) {
  return {
    type: BATTLE_UPDATE,
    payload: battle
  };
}