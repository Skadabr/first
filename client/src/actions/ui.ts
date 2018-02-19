const EMPTY = {};

const SET_DESKTOP_WIDTH = "SET_DESKTOP_WIDTH";
const TOGGLE_BATTLE_CHAT = "TOGGLE_BATTLE_CHAT";

//
// ============ Reducer ============
//

export interface UIState {}

export default function uiReducer(
  state = EMPTY as any,
  { type, payload }
) {
  switch (type) {
    case SET_DESKTOP_WIDTH:
      return { ...state, desktop_width: payload };
    case TOGGLE_BATTLE_CHAT:
      return { ...state, show_battle_chat: !state.show_battle_chat };
    default:
      return state;
  }
}

//
// ============ Actions ============
//

export function statsSetDesktopWidth(width: number) {
  return {
    type: SET_DESKTOP_WIDTH,
    payload: width
  };
}

export function toggleBattleChat() {
  return {
    type: TOGGLE_BATTLE_CHAT
  };
}
