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
  Lose
}

export const POSITIONS = 13;
export const MAX_WARRIORS_ON_FIELD = 7;
export const MIDDLE_POSITION = (POSITIONS / 2) | 0;
