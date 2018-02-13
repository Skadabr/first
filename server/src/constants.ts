export enum StatusKinds {
  PEACE,
  READY,
  FIGHT
}

export enum WarriorKinds {
  PAWN,
  OFFICER
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

export const WARRIOR_SAMPLES = [
  {
    name: "Pawn",
    kind: WarriorKinds.PAWN,
    health: 6,
    damage: 1,
    price: 1
  },

  {
    name: "Officer",
    kind: WarriorKinds.OFFICER,
    health: 6,
    damage: 2,
    price: 2
  }
];

export interface WarriorSample {
  name: string;
  kind: WarriorKinds;
  health: number;
  damage: number;
  price: number;
}
