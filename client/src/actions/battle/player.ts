import { MIDDLE_POSITION } from "../../constants";

import unitsReducer from "./units";
import userReducer from "./user";
import heroReducer from "./hero";

const EMPTY = {};

import {
  PLAYER_ADD_UNIT,
  PLAYER_REMOVE_UNIT,
  PLAYER_ADD_CARDS,
  PLAYER_REMOVE_CARD,
  PLAYER_DECREASE_MONEY
} from ".";

//
// ============ reducer ============
//

export default function playerReducer(state = EMPTY as any, action) {
  switch (action.type) {
    case PLAYER_ADD_UNIT: {
      const { unit, position } = action.payload;

      if (unit.owner_id !== state.user._id) return state;

      //const units = [...state.units, unit];
      const units = adjustUnits(state.units, unit, position);
      return { ...state, units };
    }

    case PLAYER_REMOVE_UNIT: {
      const units = state.units.filter(u => u._id !== action.payload._id);
      return { ...state, units };
    }

    case PLAYER_ADD_CARDS: {
      const cards = action.payload.filter(
        ({ owner_id }) => owner_id === state.user._id
      );
      return {
        ...state,
        hand: [...state.hand, ...cards]
      };
    }

    case PLAYER_REMOVE_CARD: {
      const { card } = action.payload;
      return {
        ...state,
        hand: state.hand.filter(c => c._id !== card._id)
      };
    }

    case PLAYER_DECREASE_MONEY: {
      const { player, cost } = action.payload;

      if (state.user._id !== player.user._id) return state;
      if (state.money < cost) return state;

      return { ...state, money: state.money - cost };
    }

    default:
      return {
        ...state,
        units: unitsReducer(state.units, action),
        hero: heroReducer(state.hero, action),
        user: userReducer(state.user, action)
      };
  }
}

export function playerAddCards(user_id, cards) {
  return { type: PLAYER_ADD_CARDS, payload: cards };
}

export function playerRemoveCard(card) {
  return { type: PLAYER_REMOVE_CARD, payload: { card } };
}

export function playerAddUnit(unit, position, effects) {
  return {
    type: PLAYER_ADD_UNIT,
    payload: { unit, position },
    effects
  };
}

export function playerDecreseMoney(player, cost) {
  return {
    type: PLAYER_DECREASE_MONEY,
    payload: { player, cost }
  };
}

//
// ============ helpers ============
//

function adjustUnits(units, unit, position) {
  if (units.length === 0) {
    return [{ ...unit, position: MIDDLE_POSITION }];
  }

  if (position > maxPosition(units))
    return adjust(shiftUnitsToLeft, units => maxPosition(units) + 2);

  if (position < minPosition(units))
    return adjust(shiftUnitsToRight, units => minPosition(units) - 2);

  return adjust(w => separateUnits(w, position), () => position);

  function adjust(move, calcPos) {
    units = units.map(move);
    unit.position = calcPos(units);
    units.push(unit);
    return units;
  }
}

function maxPosition(units) {
  return Math.max(...units.map(w => w.position));
}

function minPosition(units) {
  return Math.min(...units.map(w => w.position));
}

function shiftUnitsToLeft(w) {
  return { ...w, position: w.position - 1 };
}

function shiftUnitsToRight(w) {
  return { ...w, position: w.position + 1 };
}

function separateUnits(w, pivot) {
  return w.position < pivot
    ? { ...w, position: w.position - 1 }
    : { ...w, position: w.position + 1 };
}
