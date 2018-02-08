import { WarriorKinds } from "./constants";

export default {
  [WarriorKinds.PAWN]: {
    name: "Pawn",
    kind: WarriorKinds.PAWN,
    health: 6,
    damage: 1,
    price: 1
  },

  [WarriorKinds.OFFICER]: {
    name: "Officer",
    kind: WarriorKinds.OFFICER,
    health: 6,
    damage: 2,
    price: 2
  }
};

export interface WarriorSample {
  name: string;
  kind: WarriorKinds;
  health: number;
  damage: number;
  price: number;
}
