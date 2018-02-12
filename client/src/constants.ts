export enum StatusKinds {
  PEACE,
  READY,
  FIGHT
}

export enum WarriorKinds {
  PAWN,
  OFFICER
}

export const POSITIONS = 13;
export const MAX_WARRIORS_ON_FIELD = 7;

export const CLEAN_STATE = "CLEAN_STATE";

export const DragTypes = {
  WARRIOR: "WARRIOR"
};

export const CARD_WIDTH = 60;
export const POSITION_MIN_WIDTH = 40;
export const CARD_HEIGHT = 120;

export const GAMER_KICKED = "GAMER_KICKED";
export const WARRIOR_KICKED = "WARRIOR_KICKED";
export const WARRIOR_REMOVE = "WARRIOR_REMOVE";
export const FINISH_FIGHT = "FINISH_FIGHT";
