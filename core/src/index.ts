export enum UserStatusType {
  Peace,
  Ready,
  Fight
}

export enum UnitTypes {
  Pawn,
  Officer,
  Horse
}

export enum GameStatus {
  None,
  Active,
  Win,
  Lose,
  Broken
}

export enum EffectScope {
  Global,
  Local
}

export enum EffectImpact {
  Availability,
  Attack,
  Defend,
  Move,
  Selection
}

export const POSITIONS = 13;
export const MAX_UNITS_ON_FIELD = 7;
export const MIDDLE_POSITION = (POSITIONS / 2) | 0;
export const DECK_INIT_SIZE = 3;

export const CLEAN_STATE = "CLEAN_STATE";

export const CARD_WIDTH = 60;
export const POSITION_MIN_WIDTH = 40;
export const CARD_HEIGHT = 120;

import * as Card from "./card/index";
import * as Unit from "./unit/index";
import * as State from "./state/index";
import * as Selectors from "./selectors/index";
import * as Validators from "./validators/index";


export const card = Card;
export const unit = Unit;
export const state = State;
export const selectors = Selectors;
export const validators = Validators;
