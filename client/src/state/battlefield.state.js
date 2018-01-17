export const START_FIGHT = "START_FIGHT";
export const EMPTY = {};

//
// ============ Reducer ============
//

export default function(state, { type, payload }) {
  switch (type) {
    case START_FIGHT:


    default:
      return state;
  }
}

//
// ============ Actions ============
//

export function startFight(payload) {
  return dispatch => {
    dispatch({ type: START_FIGHT, payload });
  };
}


//
// ============ Action creators ============
//

export default class BattleField {
  constructor(fst_name, snd_name) {
    this.last_turn = snd_name;
    this.fst = {
      name: fst_name,
      warriors: []
    };
    this.snd = {
      name: snd_name,
      warriors: []
    };
  }

  add(name, warrior) {
    if (this.last_turn === name) throw new Error("It's not your turn");
    if (this.fst.name === name) this.fst.warriors.push(name)
  }

  turn(name) {
    if (this.last_turn === name) throw new Error("It's not your turn");
    this.last_turn = name;
  }
}
