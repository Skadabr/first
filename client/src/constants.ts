export enum UserStatusType {
  Peace,
  Ready,
  Fight
}

export enum UnitTypes {
  Pawn,
  Officer
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
  Targets,
  State
}

export const POSITIONS = 13;
export const MAX_UNITS_ON_FIELD = 7;
export const MIDDLE_POSITION = (POSITIONS / 2) | 0;
export const DECK_INIT_SIZE = 3;

export const CLEAN_STATE = "CLEAN_STATE";

export const DragTypes = {
  UNIT: "UNIT",
  CARD: "CARD"
};

export const CARD_WIDTH = 60;
export const POSITION_MIN_WIDTH = 40;
export const CARD_HEIGHT = 120;
