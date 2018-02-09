import {
  CLEAN_STATE,
  WarriorKinds,
  POSITIONS,
  MAX_WARRIORS_ON_FIELD
} from "../constants";

const MIDDLE_POSITION = (POSITIONS / 2) | 0;
const EMPTY = {};
const EMPTY_LIST = [];

const WARRIORS_INIT = "WARRIORS_INIT";
const WARRIORS_ADD = "WARRIORS_ADD";
const WARRIORS_RELEASE = "WARRIORS_RELEASE";
const WARRIOR_KICKED = "WARRIOR_KICKED";
const WARRIORS_SET = "WARRIORS_SET";

let id = 0;

export interface Warrior {
  id: string;
  health: number;
  kind: WarriorKinds;
  position: number;
}

export interface WarriorsState {
  [s: string]: Warrior[];
}

export default function warriorsReducer(
  state: WarriorsState = EMPTY,
  { type, payload }
) {
  const owner_name = payload && payload.owner_name;
  const warriors = state[owner_name];

  switch (type) {
    case WARRIORS_INIT:
      state = { ...state };
      payload.forEach(name => (state[name] = []));
      return state;

    case WARRIORS_ADD: {
      //    const { type, position } = payload;
      //    // fail: warrior was created inside(here) so it's create coupling
      //    const warrior = createWarrior(type);
      //    if (warriors.find(w => w.position === warrior.position)) {
      //      return state;
      //    }
      //    if (warriors.length === 0) {
      //      warrior.position = MIDDLE_POSITION;
      //      return { ...state, [owner_name]: [warrior] };
      //    }
      //    if (warriors.length >= MAX_WARRIORS_ON_FIELD) {
      //      return state;
      //    }
      //    return {
      //      ...state,
      //      [owner_name]: adjustWarriors(warriors, warrior, position)
      //    };
    }

    case WARRIORS_SET: {
      return { ...state, [owner_name]: payload.warriors };
    }

    case WARRIORS_RELEASE:
      return { ...state, [owner_name]: EMPTY_LIST };

    case WARRIOR_KICKED: {
      const { id, damage } = payload;
      let warrior = warriors.find(w => w.id === id);

      const health = warrior.health - damage;

      // just update warrior
      if (health > 0) {
        warrior = { ...warrior, health };
        return {
          ...state,
          [owner_name]: warriors.map(w => (w.id === id ? warrior : w))
        };
      }

      // eliminate dead hero :( and readjust other positions
      return {
        ...state,
        [owner_name]: warriors
          .filter(w => w.id !== id)
          .map(w => closeTheGapBetweenWarriors(w, warrior.position))
      };
    }

    default:
      return state;
  }
}

export function warriorsInit(names) {
  return {
    type: WARRIORS_INIT,
    payload: names
  };
}

export function warriorsAdd(owner_name, position, type) {
  return {
    type: WARRIORS_ADD,
    payload: { owner_name: owner_name, type, position }
  };
}

export function warriorKicked(owner_name, id, damage) {
  return {
    type: WARRIOR_KICKED,
    payload: { owner_name, id, damage }
  };
}

export function warriorsRelease(owner_name) {
  return {
    type: WARRIORS_RELEASE,
    payload: owner_name
  };
}

export function warriorsSet(owner_name, warriors) {
  return {
    type: WARRIORS_SET,
    payload: { owner_name, warriors }
  };
}

//
// ============ helpers ============
//


function closeTheGapBetweenWarriors(w, pivot) {
  return w.position < pivot
    ? { ...w, position: w.position + 1 }
    : { ...w, position: w.position - 1 };
}
