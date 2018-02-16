import { UnitTypes } from "../constants";

export default {
  [UnitTypes.Pawn]: {
    type: UnitTypes.Pawn,
    name: "Pawn",
    cost: 1,
    health: 6,
    damage: 1
  },

  [UnitTypes.Officer]: {
    type: UnitTypes.Officer,
    name: "Officer",
    cost: 2,
    init_health: 6,
    damage: 2
  }
};
