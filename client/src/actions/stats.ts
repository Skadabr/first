const EMPTY = {};

const SET_DESKTOP_WIDTH = "SET_DESKTOP_WIDTH";

//
// ============ Reducer ============
//

export interface StatsState {
  desktopWidth?: number;
}

export default function statsReducer(
  state: StatsState = EMPTY,
  { type, payload }
): StatsState {
  switch (type) {
    case SET_DESKTOP_WIDTH:
      return { ...state, desktopWidth: payload };
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
    payload: width,
  }
}
