import { toggleActivityEffect } from "./effects";
import { UnitTypes } from "../../constants";

export default {
  [UnitTypes.Pawn]: {
    type: UnitTypes.Pawn,
    name: "Pawn",
    cost: 1,
    health: 6,
    damage: 1,
    effects: [toggleActivityEffect()]
  },

  [UnitTypes.Officer]: {
    type: UnitTypes.Officer,
    name: "Officer",
    cost: 2,
    health: 6,
    damage: 2,
    effects: [toggleActivityEffect()]
  }
};
