export const START_FIGHT = "START_FIGHT";
export const ADD_WARRIOR = "ADD_WARRIOR";

export const EMPTY = {};
export const ME = "ME";
export const OPPONENT = "OPPONENT";

//
// ============ Reducer ============
//

export default function(state = EMPTY, { type, payload }) {
  switch (type) {
    case START_FIGHT:
      return { ...payload, show_chat: true };

    case ADD_WARRIOR:
      const { who, warriors } = payload;
      const gamer = { ...state[who], warriors };
      return { ...state, [who]: gamer };

    default:
      return state;
  }
}

//
// ============ Actions ============
//

export function startFight(payload) {
  return dispatch => {
    payload[ME].warriors = [];
    payload[OPPONENT].warriors = [];
    dispatch({ type: START_FIGHT, payload });
  };
}

export function addWarrior(who, game, warrior) {
  return dispatch => {
    let warriors = game[who].warriors;

    if (warriors.length > 5) return;
    //throw Error("too much warriors on the battle field");

    if (warriors.length === 0) {
      warrior.position = 4;
      return dispatch({
        type: ADD_WARRIOR,
        payload: { who, warriors: [warrior] }
      });
    }

    warrior.position = warriors[warriors.length - 1].position + 1;
    warriors = warriors.map(w => ({ ...w, position: w.position - 1 }));
    warriors.push(warrior);

    dispatch({ type: ADD_WARRIOR, payload: { who, warriors } });
  };
}

//
// ============ Action creators ============
//
