import { MIDDLE_POSITION } from "../../index";

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
} from "./index";

//
// ============ reducer ============
//

export default function playerReducer(state = EMPTY as any, action) {
  switch (action.type) {
    case PLAYER_ADD_UNIT: {
      const { unit, position } = action.payload;

      if (unit.ownerId !== state.user._id) return state;

      //const units = [...actions.units, unit];
      const units = adjustUnitsOnAdd(state.units, unit, position);
      return { ...state, units };
    }

    case PLAYER_REMOVE_UNIT: {
      const {unitId, ownerId} = action.payload;

      if (ownerId !== state.user._id) return state;

      const pivot = state.units.find(u => u._id === unitId).position;
      const units = state.units.filter(u => u._id !== unitId);
      const adjustedUnits = adjustUnitsOnRemove(units, pivot);

      return { ...state, units: adjustedUnits };
    }

    case PLAYER_ADD_CARDS: {
      const cards = action.payload.filter(
        ({ ownerId }) => ownerId === state.user._id
      );
      return {
        ...state,
        hand: [...state.hand, ...cards]
      };
    }

    case PLAYER_REMOVE_CARD: {
      const { cardId } = action.payload;
      return {
        ...state,
        hand: state.hand.filter(c => c._id !== cardId)
      };
    }

    case PLAYER_DECREASE_MONEY: {
      const { playerUserId, cost } = action.payload;

      if (state.user._id !== playerUserId) return state;
      if (state.money < cost) return state;

      return { ...state, money: state.money - cost };
    }

    case PLAYER_ADJUST_MONEY: {
      const { playerUserId } = action.payload;

      if (state.user._id !== playerUserId) return state;

      const pocketSize =
        state.pocketSize < 10 ? state.pocketSize + 1 : state.pocketSize;
      const money = pocketSize;

      return { ...state, money, pocketSize };
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

export function playerAddCards(userId, cards) {
  return { type: PLAYER_ADD_CARDS, payload: cards };
}

export function playerRemoveCard(cardId) {
  return { type: PLAYER_REMOVE_CARD, payload: { cardId } };
}

export function playerAddUnit(unit, position) {
  return {
    type: PLAYER_ADD_UNIT,
    payload: { unit, position },
  };
}

export function playerRemoveUnit(unitId, ownerId) {
  return {
    type: PLAYER_REMOVE_UNIT,
    payload: { unitId, ownerId },
  };
}

export function playerDecreseMoney(playerUserId, cost) {
  return {
    type: PLAYER_DECREASE_MONEY,
    payload: { playerUserId, cost }
  };
}

export function playerAdjustMoney(playerUserId) {
  return {
    type: PLAYER_ADJUST_MONEY,
    payload: { playerUserId }
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
