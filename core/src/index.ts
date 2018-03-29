import * as _utils from "./utils";

export enum UserStatusType {
  Peace = "PEACE",
  Ready = "READY",
  Fight = "FIGHT"
}
export enum UnitTypes {
  Pawn = "PAWN",
  Officer = "OFFICER",
  Horse = "HORSE"
}
export enum GameStatus {
  None,
  Active,
  Win,
  Lose,
  Broken
}

export enum EffectTypes {
  Health = "HEALTH",
  Attack = "ATTACK",
  Taunt = "TAUNT",
  UnTaunt = "UN_TAUNT"
}

export enum EffectTargetingScope {
  Local = "LOCAL",
  AllUnits = "ALL_UNITS",
  AllEnemyUnits = "ALL_ENEMY_UNITS",
  AllEnemyMinions = "ALL_ENEMY_MINIONS",
  AllFriendlyUnits = "ALL_FRIENDLY_UNITS",
  AllFriendlyMinions = "ALL_FRIENDLY_MINIONS",
  OtherFriendlyMinions = "OTHER_FRIENDLY_MINIONS"
}

export enum EffectImpact {
  Availability = "AVAILABILITY",
  Attack = "ATTACK",
  Health = "HEALTH",
  Trade = "TRADE"
}

export const POSITIONS = 13;
export const MAX_UNITS_ON_FIELD = 7;
export const MIDDLE_POSITION = (POSITIONS / 2) | 0;

export const CLEAN_STATE = "CLEAN_STATE";

export const utils = _utils;

export { Battle } from "./battle/index";
