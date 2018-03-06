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
  PLAYER_DECREASE_MONEY,
  PLAYER_ADJUST_MONEY
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
      const units = adjustUnitsOnAdd(state.units, unit, position);
      return { ...state, units };
    }

    case PLAYER_REMOVE_UNIT: {
      const {unit_id, owner_id} = action.payload;

      if (owner_id !== state.user._id) return state;

      const pivot = state.units.find(u => u._id === unit_id).position;
      const units = state.units.filter(u => u._id !== unit_id);
      const adjustedUnits = adjustUnitsOnRemove(units, pivot);

      return { ...state, units: adjustedUnits };
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
      const { player_user_id, cost } = action.payload;

      if (state.user._id !== player_user_id) return state;
      if (state.money < cost) return state;

      return { ...state, money: state.money - cost };
    }

    case PLAYER_ADJUST_MONEY: {
      const { player_user_id } = action.payload;

      if (state.user._id !== player_user_id) return state;

      const pocket_size =
        state.pocket_size < 10 ? state.pocket_size + 1 : state.pocket_size;
      const money = pocket_size;

      return { ...state, money, pocket_size };
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

export function playerAddUnit(unit, position) {
  return {
    type: PLAYER_ADD_UNIT,
    payload: { unit, position },
  };
}

export function playerRemoveUnit(unit_id, owner_id) {
  return {
    type: PLAYER_REMOVE_UNIT,
    payload: { unit_id, owner_id },
  };
}

export function playerDecreseMoney(player_user_id, cost) {
  return {
    type: PLAYER_DECREASE_MONEY,
    payload: { player_user_id, cost }
  };
}

export function playerAdjustMoney(player_user_id) {
  return {
    type: PLAYER_ADJUST_MONEY,
    payload: { player_user_id }
  };
}

//
// ============ helpers ============
//

function adjustUnitsOnAdd(units, unit, position) {
  if (units.length === 0) {
    return [{ ...unit, position: MIDDLE_POSITION }];
  }

  if (position >= maxPosition(units))
    return adjust(shiftUnitsToLeft, units => maxPosition(units) + 2);

  if (position <= minPosition(units))
    return adjust(shiftUnitsToRight, units => minPosition(units) - 2);

  return adjust(w => separateUnits(w, position), () => position);

  function adjust(move, calcPos) {
    units = units.map(move);
    unit.position = calcPos(units);
    units.push(unit);
    return units;
  }
}

function adjustUnitsOnRemove(units, position) {
  if (units.length === 0) return [];

  if (position >= maxPosition(units)) return adjust(shiftUnitsToRight);

  if (position <= minPosition(units)) return adjust(shiftUnitsToLeft);

  return adjust(w => convergeUnits(w, position));

  function adjust(move) {
    return units.map(move);
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

function separateUnits(u, pivot) {
  return u.position < pivot
    ? { ...u, position: u.position - 1 }
    : { ...u, position: u.position + 1 };
}

function convergeUnits(u, pivot) {
  return u.position < pivot
    ? { ...u, position: u.position + 1 }
    : { ...u, position: u.position - 1 };
}
