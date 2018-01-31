export const PAWN = "PAWN";
export const OFFICER = "OFFICER";

export const POSITIONS = 13;
const MIDDLE_POSITION = 6;

let id = 0;

export default function warriorsReducer(state = {}, { type, payload }) {
  const { owner_name } = payload;
  const warriors = state[owner_name];

  switch (type) {
    case WARRIORS_ADD: {
      const { type, position } = payload;

      const warrior = createWarrior(type);

      if (warriors.find(w => w.position === warrior.position)) {
        return state;
      }

      if (warriors.length === 0) {
        warrior.position = MIDDLE_POSITION;
        return { ...state, [owner_name]: [warrior] };
      }

      if (position > maxPosition(warriors)) {
        return adjust(
          warriors,
          shiftWarriorsToLeft,
          wrs => maxPosition(wrs) + 2
        );
      }
      if (position < minPosition(warriors)) {
        return adjust(
          warriors,
          shiftWarriorsToRight,
          wrs => minPosition(wrs) - 2
        );
      }
      return adjust(
        warriors,
        w => separateMyWarriors(w, position),
        () => position
      );
    }

    case WARRIORS_RELEASE:
      return [];

    case WARRIOR_KICKED: {
      const { id, damage } = payload;
      let warrior = warriors.find(w => warrior.id === id);

      const health = warrior.health - damage;

      // just update warrior
      if (health > 0) {
        warrior = { ...warrior, health };
        warriors = warriors.map(w => (w.id === id ? warrior : w));
        return { ...state, [owner_name]: warriors };
      }

      // eliminate dead hero :( and readjust other positions
      return warriors
        .filter(w => w.id !== id)
        .map(w => separateMyWarriors(w, warrior.position));
    }

    default:
      return state;
  }
}

export function warriorsAdd(owner_name, type, position) {
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

//
// ============ helpers ============
//

function createWarrior(type) {
  switch (type) {
    case PAWN:
      return {
        type: WARRIOR_CREATE,
        payload: {
          type: PAWN,
          health: 6,
          damage: 1,
          id: id++,
        }
      };
    case OFFICER:
      return {
        type: WARRIOR_CREATE,
        payload: {
          type: OFFICER,
          health: 4,
          damage: 2,
          id: id++,
        }
      };
  }
}

function maxPosition(wrs) {
  return Math.max(...wrs.map(w => w.position));
}

function minPosition(wrs) {
  return Math.min(...wrs.map(w => w.position));
}

function shiftWarriorsToLeft(w) {
  return { ...w, position: w.position - 1 };
}

function shiftWarriorsToRight(w) {
  return { ...w, position: w.position + 1 };
}

function separateMyWarriors(w, pivot) {
  return w.position < pivot
    ? { ...w, position: w.position - 1 }
    : { ...w, position: w.position + 1 };
}

function adjust(move, calcPos) {
  warriors = warriors.map(move);
  warriors.position = calcPos(warriors);
  warriors.push(warrior);
  return { ...state, [owner_name]: warriors };
}
