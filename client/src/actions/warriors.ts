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
const WARRIORS_RELEASE = "WARRIORS_RELEASE";
const WARRIORS_SET = "WARRIORS_SET";
const WARRIOR_UPDATE = "WARRIOR_UPDATE";
const WARRIOR_KICKED = "WARRIOR_KICKED";
const WARRIOR_REMOVE = "WARRIOR_REMOVE";

export interface Warrior {
  _id: string;
  health: number;
  kind: WarriorKinds;
  position: number;
  damaged: boolean;
  attacking: boolean;
}

export interface WarriorsState {
  [s: string]: Warrior[];
}

export default function warriorsReducer(
  state: WarriorsState = EMPTY,
  { type, payload, owner_name }
): WarriorsState {
  const warriors = state[owner_name];

  switch (type) {
    case WARRIORS_INIT:
      state = { ...state };
      payload.forEach(name => (state[name] = []));
      return state;

    case WARRIORS_SET: {
      return { ...state, [owner_name]: payload.warriors };
    }

    case WARRIORS_RELEASE:
      return { ...state, [owner_name]: EMPTY_LIST };

    case WARRIOR_UPDATE:
      return {
        ...state,
        [owner_name]: warriors.map(
          w => (w._id === payload._id ? { ...w, ...payload } : w)
        )
      };

    case WARRIOR_KICKED: {
      const { _id, health } = payload;
      let warrior = warriors.find(w => w._id === _id);

      if (!warrior) return state;

      // just update warrior and sign him as damaged
      if (health > 0) {
        warrior = { ...warrior, health, damaged: true };
        return {
          ...state,
          [owner_name]: warriors.map(w => (w._id === _id ? warrior : w))
        };
      }
      return state;
    }

    case WARRIOR_REMOVE:
      return {
        ...state,
        [owner_name]: removeWarrior(warriors, payload._id)
      };

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

export function warriorIsKicked(owner_name, _id, health) {
  return {
    type: WARRIOR_KICKED,
    owner_name,
    payload: { _id, health }
  };
}

export function warriorRemove(owner_name, _id) {
  return {
    type: WARRIOR_REMOVE,
    owner_name,
    payload: { _id }
  };
}

export function warriorIsDamaged(owner_name, _id, damaged) {
  return {
    type: WARRIOR_UPDATE,
    owner_name,
    payload: { damaged, _id }
  };
}

export function warriorIsAttacking(owner_name, _id, attacking) {
  return {
    type: WARRIOR_UPDATE,
    owner_name,
    payload: { attacking, _id }
  };
}

export function warriorsRelease(owner_name) {
  return {
    type: WARRIORS_RELEASE,
    owner_name
  };
}

export function warriorsSet(owner_name, warriors) {
  return {
    type: WARRIORS_SET,
    owner_name,
    payload: { warriors }
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

function removeWarrior(warriors, id) {
  let warrior = warriors.find(w => w._id === id);

  return !warrior
    ? warriors
    : warriors
        // eliminate dead hero :( and readjust other positions
        .filter(w => w._id !== id)
        .map(w => closeTheGapBetweenWarriors(w, warrior.position));
}
